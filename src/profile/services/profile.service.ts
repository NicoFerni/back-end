import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { RedesDto } from "../dtos/socialNetwork.dto";
import 'firebase/storage';
import { app } from "src/firebase/firebase.config";
import { v4 as uuidv4 } from 'uuid';
import { TechnologiesService } from "./programingLanguagesList.service";
import { SelectedTechnologiesDto } from "../dtos/selectedTechnologies.dto";
import { Disponibilidad } from "../../typeorm/profile.entity";

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
    const profile = await this.profileRepository.findOne({ where: { Id: Id } });

    if (!profile) {
      throw new NotFoundException(`Profile not found with this ID`)
    } {
      return profile
    }
  }

  async findProfileByUrl(profileUrl: string): Promise<Profile> {

    const user: User = await this.usersRepository.findOne({ where: { profileUrl: profileUrl } })
    if (!user) {
      throw new NotFoundException(`User not found with the provided rofile URL`);
    }

    const profile: Profile = await this.profileRepository.findOne({ where: { Id: user.profile } });
    if (!profile) {
      throw new NotFoundException(`Profile not found for the user with the Provided profile URL`);
    }

    return profile;

  }

  async getTechnologies() {
    return this.programingLangaugesService.getTechnologies()
  }

  async getProfiles(): Promise<Profile[]> {
    const profiles = await this.profileRepository.find()

    return profiles
  }

  async getLanguages() {
    return this.languagesService.getLanguages()
  }

  async getLocation() {
    return this.locationService.getCountries()
  }

  async deleteProfile(id: string): Promise<void> {
    const deleteProfile = await this.profileRepository.delete(id)

    if (deleteProfile.affected === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    } {
      throw new HttpException('Profile deleted', 200)
    }
  }


  async availability(disponibilidadDto: disponibilidadDto, Id: any): Promise<Profile> {
    let { horas, dias, activo } = disponibilidadDto;
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

    profile.nacimiento = nacimiento

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


  async social(Id: string, redesDto: RedesDto): Promise<Profile> {
    const { facebook, instagram, twitter, reddit, linkedin, youtube, discord, whatsapp, github, threads, areaCode } = redesDto
    const profile = await this.findProfileById(Id)

    profile.redes = {
      facebook: facebook ? `facebook.com/${facebook}` : null,
      instagram: instagram ? `instagram.com/${instagram}` : null,
      twitter: twitter ? `x.com/${twitter} ` : null,
      reddit: reddit ? `reddit.com/user/${reddit}` : null,
      linkedin: linkedin ? `linkedin.com/in/${linkedin}` : null,
      youtube: youtube ? `youtube.com/${youtube}` : null,
      discord: discord ? discord : null,
      areaCode: areaCode ? areaCode : null,
      whatsapp: whatsapp ? whatsapp : null,
      github: github ? `github.com/${github}` : null,
      threads: threads ? `threads.net/${threads}` : null
    }

    if (profile.redes) {
      Object.keys(profile.redes).forEach((key) => (profile.redes[key] == null) && delete profile.redes[key]);
    }

    await this.profileRepository.save(profile);

    return profile;
  }




  async saveImage(file: any, Id: string): Promise<Profile> {

    if(typeof file === 'string'){
      const profile = await this.profileRepository.findOne({ where: { Id: Id } });

      profile.fotoDePerfil = file

      await this.profileRepository.save(profile)
      return profile;
    }
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

  async createProfile(createProfileDto: CreateProfileDto, userId: string, redesDto: RedesDto): Promise<Profile> {
    let { pais, ciudad, idiomas, horas, dias, activo, redes, profileUrl, ...profileData } = createProfileDto;

    const ubicacion = { pais: pais, ciudad: ciudad };
    const disponibilidad = { horas: horas, dias: dias, activo: activo }


    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.hasProfile) {
      throw new HttpException('User already has a profile', HttpStatus.BAD_REQUEST);
    }

    user.hasProfile = true;
    await this.usersRepository.save(user);

    userId = user.id

    profileUrl = user.profileUrl
    const profile = this.profileRepository.create({ ...profileData, ubicacion, disponibilidad, idiomas, userId, profileUrl });


    await this.profileRepository.save(profile);
    await this.social(profile.Id, redesDto);


    return profile
  }

  async modifyProfile(createProfileDto: CreateProfileDto, userId: string, redesDto: RedesDto): Promise<Profile> {
    const { pais, ciudad, idiomas, horas, dias, activo, redes, profileUrl, ...profileData } = createProfileDto;
    const ubicacion = { pais: pais, ciudad: ciudad };
    const disponibilidad: Disponibilidad = { horas: horas, dias: dias, activo: activo };
  
    const user: User = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    const existingProfile: Profile = await this.profileRepository.findOne({ where: { userId: user.id } });
    if (!existingProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }



    user.hasProfile = true;
    await this.usersRepository.save(user);
  
    existingProfile.ubicacion = ubicacion;
    existingProfile.disponibilidad = disponibilidad;
    existingProfile.idiomas = idiomas;
    existingProfile.profileUrl = user.profileUrl;
    Object.assign(existingProfile, profileData);
  
    const updatedProfile = await this.profileRepository.save(existingProfile);
  
    await this.social(updatedProfile.Id, redesDto);
  
    return updatedProfile;
  }
  

}
