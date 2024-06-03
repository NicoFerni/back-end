import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, User } from "src/typeorm";
import { Repository } from "typeorm";
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
import { TechnologiesService } from "./programingLanguagesList.service";
import { SelectedTechnologiesDto } from "../dtos/selectedTechnologies.dto";


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly languagesService: LanguagesService,
    private readonly locationService: LocationService,
    private readonly programingLangaugesService: TechnologiesService
    ) { }


  async findProfileById(Id: any): Promise<Profile> {
    const profile = await this.profileRepository.findOne(Id);
    if (!profile) {
      throw new NotFoundException(`Perfil con ID ${Id} no encontrado`);
    }
    return profile;
  }

  async getTechnologies() {
    return this.programingLangaugesService.getTechnologies()
  }

  async getProfiles(): Promise<Profile[]> {
    const profiles = await this.profileRepository.find()

    return Promise.all(profiles.map(profile => this.transformProfile(profile)))
  }

  async getLanguages() {
    return this.languagesService.getLanguages()
  }

  async getLocation() {
    return this.locationService.getCountries()
  }


  async availability(disponibilidadDto: disponibilidadDto, Id: any): Promise<Profile> {
    const { horas, dias, activo } = disponibilidadDto;
    const profile = await this.findProfileById(Id);
  
  
    profile.disponibilidad = {
      horas: horas,
      dias: dias,
      activo: activo,
    };
  
    await this.profileRepository.save(profile);
  
    return profile;
  }
  
  

  async experience(experienceDto: ExperienceDto, Id: any): Promise<Profile> {
    const { experiencia } = experienceDto
    const profile = await this.findProfileById(Id)

    profile.experiencia = experiencia
    await this.profileRepository.save(profile)

    return profile
  }

  async education(educationDto: EducationDto, Id: any): Promise<Profile> {
    const { estudios } = educationDto
    const profile = await this.findProfileById(Id)

    profile.estudios = estudios
    await this.profileRepository.save(profile)

    return profile
  }

  async birthday(birthdayDto: BirthdayDto, Id: string): Promise<Profile> {
    const { nacimiento } = birthdayDto

    const profile = await this.findProfileById(Id)

    profile.nacimiento = new Date(nacimiento)

    await this.profileRepository.save(profile)

    return profile
  }

  async selectedTech(selectedTechnologiesDto: SelectedTechnologiesDto, Id: string): Promise<object> {
    const technologies = this.programingLangaugesService.getTechnologies();
    const selectedTechnologies: string[] = []
    const profile = await this.findProfileById(Id)

    for (const tech of selectedTechnologiesDto.selectedTechnologies) {
      if (technologies[tech]) {
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


    if (!languageName) {
      throw new NotFoundException(`Language with code ${selectedLanguageDto.selectedLanguage} not found`)
    }
    profile.idiomas = languageName
    await this.profileRepository.save(profile)

    return profile
  }

  async gender(genderDto: GenderDto, Id: string): Promise<Profile> {
    const { sexo } = genderDto

    const profile = await this.findProfileById(Id)

    profile.sexo = sexo

    await this.profileRepository.save(profile)

    return profile
  }

  async social(Id: string, redesData: Partial<{  facebook: string; instagram: string; threads: string; twitter: string; reddit: string; linkedin: string; youtube: string; discord: string; whatsapp: string; github: string; areaCode: string; }>): Promise<Profile> {


    const profile = await this.profileRepository.findOne({ where: { Id: Id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${Id} not found`);
    }
  
    // Update the 'redes' field directly in the Profile entity
    profile.redes = redesData;
  
    await this.profileRepository.save(profile);
  
    return profile;
  }
  

  async saveImage(file: Express.Multer.File, Id: string): Promise<Profile> {
    try {
      const bucket = app.storage().bucket()
      const uuid = uuidv4()


      const uploadResponse = await bucket.upload(file.path, {
        destination: `profile-picture/${file.originalname}`,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          }
        }
      })


      const fileName = uploadResponse[0].name;
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

      const profile = await this.profileRepository.findOne({ where: { Id: Id } });


      profile.fotoDePerfil = url

      await this.profileRepository.save(profile)


      return profile;
    }
    catch (error) {
      console.error("Error during image upload:", error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }


  async transformProfile(profile: Profile): Promise<Profile> {
    const transformedProfile = profile

    if (transformedProfile.redes) {
      Object.keys(transformedProfile.redes).forEach(key => {
        if (transformedProfile.redes[key] === null) {
          delete transformedProfile.redes[key];
        }
      });
    }

    return transformedProfile;
  }


  async createProfile(createProfileDto: CreateProfileDto, userId: string): Promise<Profile> {
    const { facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode, disponibilidad, pais, ciudad, idiomas, ...profileData } = createProfileDto;
  
    const redes = { facebook: facebook, instagram: instagram, threads: threads, twitter: twitter, reddit: reddit, linkedin: linkedin, youtube: youtube, discord: discord, whatsapp: whatsapp, github: github, areaCode: areaCode };
    const ubicacion = { pais: pais, ciudad: ciudad };
  
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.hasProfile = true;
    await this.usersRepository.save(user);

    const profile = this.profileRepository.create({ ...profileData, ubicacion, idiomas, disponibilidad, redes, userId: user.id });
   
    
    await this.profileRepository.save(profile);
  
    return this.transformProfile(profile);
  }
  
}

