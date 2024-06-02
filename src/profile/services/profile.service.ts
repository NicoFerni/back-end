import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, Redes, User } from "src/typeorm";
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
import { Disponibilidad } from "../../typeorm/availability.entity";
import { TechnologiesService } from "./programingLanguagesList.service";
import { SelectedTechnologiesDto } from "../dtos/selectedTechnologies.dto";


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Redes)
    private readonly redesRepository: Repository<Redes>,
    @InjectRepository(Disponibilidad)
    private disponibilidadRepository: Repository<Disponibilidad>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly languagesService: LanguagesService,
    private readonly locationService: LocationService,
    private readonly programingLangaugesService: TechnologiesService,
    private httpService: HttpService
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

  async getProfiles() {
    return this.profileRepository.find()
  }

  async getLanguages() {
    return this.languagesService.getLanguages()
  }

  async getLocation() {
    return this.locationService.getCountries()
  }


  async disponibilidad(disponibilidadDto: disponibilidadDto, Id: any): Promise<Profile> {
    const { horas, dias, activo } = disponibilidadDto
    const profile = await this.findProfileById(Id)

    const availability = new Disponibilidad();
    availability.horas = horas;
    availability.dias = dias;
    availability.activo = activo;

    profile.disponibilidad = availability

    await this.profileRepository.save(profile);

    return profile
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

  async social(Id: string, redesData: Partial<Redes>): Promise<Redes> {
    const profile = await this.profileRepository.findOne({ where: { Id: Id }, relations: ['redes'] });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${Id} not found`);
    }
    let redes: Redes;
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
    const transformedProfile = { ...profile };


    Object.keys(transformedProfile.redes).forEach(key => {
      if (transformedProfile.redes[key] === null) {
        delete transformedProfile.redes[key];
      }
    });


    if (transformedProfile.redes) {
      Object.keys(transformedProfile.redes).forEach(key => {
        if (transformedProfile.redes[key] === null || key === 'id') {
          delete transformedProfile.redes[key];
        }
      });
    }


    if (transformedProfile.disponibilidad) {
      Object.keys(transformedProfile.disponibilidad).forEach(key => {
        if (key === 'Id') {
          delete transformedProfile.disponibilidad[key];
        }
      });
    }
  
    return transformedProfile;
  }


  async createProfile(createProfileDto: CreateProfileDto, userId: string): Promise<Profile> {
    const { facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode, horas, dias, activo, pais, ciudad, idiomas, ...profileData } = createProfileDto;



    const redes = this.redesRepository.create({ facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode })
    await this.redesRepository.save(redes);

  
    const ubicacion = { pais: pais, ciudad: ciudad }
    const disponibilidad = this.disponibilidadRepository.create({ horas, dias, activo })
    await this.disponibilidadRepository.save(disponibilidad)


    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found');
    }
    user.hasProfile = true
    await this.usersRepository.save(user);

    userId = user.id

    const profile = this.profileRepository.create({ ...profileData, redes, disponibilidad, userId, ubicacion, idiomas})
    await this.profileRepository.save(profile);
    profile.disponibilidad = disponibilidad;


    return this.transformProfile(profile)
  }
}

