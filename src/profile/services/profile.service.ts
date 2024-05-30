import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, redes, User } from "src/typeorm";
import { Repository } from "typeorm";
import { HttpService } from '@nestjs/axios';
import { LanguagesService } from "./languages.service";
import { LocationService } from "./location.service";
import { disponibilidadDto } from "../dtos/availability.dto";
import { ExperienceDto } from "../dtos/experience.dto";
import { EducationDto } from "../dtos/education.dto";
import { BirthdayDto } from "../dtos/birthday.dto";
import { GenderDto } from "../dtos/gender.dto";
import { CreateProfileDto } from "../dtos/createProfile.dto";
import { SelectedLanguageDto } from "../dtos/selectedLanguage.dto";
import 'firebase/storage';
import { app } from "src/firebase/firebase.config";
import { v4 as uuidv4 } from 'uuid';
import { disponibilidad } from "../../typeorm/availability.entity";
import { TechnologiesService } from "./programingLanguagesList.service";
import { SelectedTechnologiesDto } from "../dtos/selectedTechnologies.dto";


@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(Profile) 
        private readonly profileRepository: Repository<Profile>, 
        @InjectRepository(redes)
        private readonly redesRepository: Repository<redes>,
        @InjectRepository(disponibilidad)
        private disponibilidadRepository: Repository<disponibilidad>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly languagesService: LanguagesService,
        private readonly locationService: LocationService,
        private readonly programingLangaugesService: TechnologiesService,
        private httpService: HttpService
    ) {}


    async findProfileById(Id:any): Promise<Profile>{
      const profile = await this.profileRepository.findOne(Id);
      if (!profile) {
        throw new NotFoundException(`Perfil con ID ${Id} no encontrado`);
      }
      return profile;
    }

    async getTechnologies(){
      return this.programingLangaugesService.getTechnologies()
    }

    async getProfiles(){
      return this.profileRepository.find()
    }

    async getLanguages() {
      return this.languagesService.getLanguages()
    }

    async getLocation() {
      return this.locationService.getCountries()
    }
    

    async disponibilidad(disponibilidadDto: disponibilidadDto, Id: any ): Promise<Profile> {
       const {horasSemanales, diasDisponibles, activo} = disponibilidadDto
       const profile = await this.findProfileById(Id)
      
       const availability = new disponibilidad();
       availability.horasSemanales = horasSemanales;
       availability.diasDisponibles = diasDisponibles;
       availability.activo = activo;

        profile.disponibilidad = new disponibilidad;

       await this.profileRepository.save(profile);

       return profile
     }

    async experience(experienceDto: ExperienceDto, Id: any) : Promise<Profile>{
        const { experiencia } = experienceDto
        const profile = await this.findProfileById(Id)

        profile.experiencia = experiencia
        await this.profileRepository.save(profile)

        return profile
     }

     async education(educationDto: EducationDto, Id:any) : Promise<Profile>{
      const { estudios } = educationDto
      const profile = await this.findProfileById(Id)

      profile.estudios = estudios
      await this.profileRepository.save(profile)

      return profile
     }

     async birthday(birthdayDto: BirthdayDto, Id: string) : Promise<Profile>{
      const { nacimiento } = birthdayDto

      const profile = await this.findProfileById(Id)

      profile.nacimiento = new Date(nacimiento)

      await this.profileRepository.save(profile)

      return profile
     }

     async selectedTech(selectedTechnologiesDto: SelectedTechnologiesDto, Id: string): Promise <object>{
      const technologies = this.programingLangaugesService.getTechnologies();
      const selectedTechnologies: string[] = []
      const profile = await this.findProfileById(Id)
      
      for(const tech of selectedTechnologiesDto.selectedTechnologies){
        if(technologies[tech]){
          selectedTechnologies.push(technologies[tech])
        }
      }

      profile.conocimientos = selectedTechnologies;
      await this.profileRepository.save(profile)

      return selectedTechnologies
     }

     async selectedLanguage(selectedLanguageDto: SelectedLanguageDto, Id: string): Promise<Profile> {
        const languages = this.languagesService.getLanguages()
        const languageName = languages[selectedLanguageDto.selectedLanguage]
        const profile = await this.findProfileById(Id)


        if(!languageName) {
          throw new NotFoundException(`Language with code ${selectedLanguageDto.selectedLanguage} not found`)
        }
        profile.idiomas = languageName
        await this.profileRepository.save(profile)

        return profile
     }

     async gender(genderDto: GenderDto, Id: string) : Promise<Profile>{
      const { genero } = genderDto

      const profile = await this.findProfileById(Id)

      profile.genero = genero

      await this.profileRepository.save(profile)

      return profile
     }

     async social(Id: string, redesData: Partial<redes>): Promise<redes> {
      const profile =await this.profileRepository.findOne({ where: { Id: Id }, relations: ['redes'] });
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${Id} not found`);
      }
      let redes: redes;
      if (profile.redes) {
        redes = this.redesRepository.merge(profile.redes, redesData);
      } else {
        redes = this.redesRepository.create(redesData);
        profile.redes = redes;
        await this.profileRepository.save(profile);
      }
      await this.redesRepository.save(redes);
    
      return redes;
    } 

    async saveImage(file: Express.Multer.File, Id: string): Promise<Profile>{
      try{ 

        console.log("Starting image upload...");
        const bucket = app.storage().bucket()
        const uuid = uuidv4()


        const uploadResponse = await bucket.upload(file.path,{
          destination: `profile-picture/${file.originalname}`,
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            }
          }
        })
        
        console.log("Image uploaded successfully!");
    

        const fileName = uploadResponse[0].name;
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

        const profile = await this.profileRepository.findOne({ where: { Id: Id } });
    

        profile.fotoDePerfil = url
  
        await this.profileRepository.save(profile)
  
        console.log("Profile picture URL updated:", url);
        if (profile) {
          console.log("Profile details:", profile);
      } else {
          console.log("Profile not found for ID:", Id);
      }


        return profile; 
      }
      catch (error) {
        console.error("Error during image upload:", error);

        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
    }

    
     async createProfile(createProfileDto: CreateProfileDto, userId: string): Promise<Profile>{
       const { facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode, horasSemanales, diasDisponibles, activo, ...profileData } = createProfileDto;
       
       const redes = this.redesRepository.create({facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode})
       const disponibilidad = this.disponibilidadRepository.create({horasSemanales, diasDisponibles, activo})

       await this.disponibilidadRepository.save(disponibilidad)
       await this.redesRepository.save(redes)



       const user = await this.usersRepository.findOne({where: {id: userId }})
       if (!user) {
        throw new Error('User not found');
      }
       user.hasProfile = true
       await this.usersRepository.save(user);

       userId = user.id
     
       const profile = this.profileRepository.create({...profileData, redes, disponibilidad, userId})
       await this.profileRepository.save(profile);

   return profile;
   }

  }
 
 