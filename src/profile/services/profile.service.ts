import { HttpException, HttpStatus, Injectable, NotFoundException, UseInterceptors, UploadedFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, SocialNetworks } from "src/typeorm";
import { Repository } from "typeorm";
import { HttpService } from '@nestjs/axios';
import { LanguagesService } from "./languages.service";
import { LocationService } from "./location.service";
import { AvailabilityDto } from "../dtos/availability.dto";
import { ExperienceDto } from "../dtos/experience.dto";
import { EducationDto } from "../dtos/education.dto";
import { BirthdayDto } from "../dtos/birthday.dto";
import { GenderDto } from "../dtos/gender.dto";
import { CreateProfileDto } from "../dtos/createProfile.dto";
import { SelectedLanguageDto } from "../dtos/selectedLanguage.dto";
import 'firebase/storage';
import * as admin from 'firebase-admin';
import { app } from "src/firebase/firebase.config";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(Profile) 
        private readonly profileRepository: Repository<Profile>, 
        @InjectRepository(SocialNetworks)
        private readonly socialNetworksRepository: Repository<SocialNetworks>,
        private readonly languagesService: LanguagesService,
        private readonly locationService: LocationService,
        private httpService: HttpService
    ) {}


    async findProfileById(profileId:any): Promise<Profile>{
      const profile = await this.profileRepository.findOne(profileId);
      if (!profile) {
        throw new NotFoundException(`Perfil con ID ${profileId} no encontrado`);
      }
      return profile;
    }


    async getLanguages() {
      return this.languagesService.getLanguages()
    }

    async getLocation() {
      return this.locationService.getCountries()
    }

    async availability(availabilityDto: AvailabilityDto, profileId: any ) {
       const { weeklyHours, availableDays, currentlyActive } = availabilityDto
       this.profileRepository.findOne({ where : {profileId:(profileId) }})

       const profile = await this.profileRepository.findOne(profileId);
       if (!profile) {
         throw new NotFoundException(`Profile with ID ${profileId} not found`);
       }
     }

    async experience(experienceDto: ExperienceDto, profileId: any) : Promise<Profile>{
        const { experience } = experienceDto
        const profile = await this.findProfileById(profileId)

        profile.experience = experience
        await this.profileRepository.save(profile)

        return profile
     }

     async education(educationDto: EducationDto, profileId:any) : Promise<Profile>{
      const { education } = educationDto
      const profile = await this.findProfileById(profileId)

      profile.education = education
      await this.profileRepository.save(profile)

      return profile
     }

     async birthday(birthdayDto: BirthdayDto, profileId: string) : Promise<Profile>{
      const { birthday } = birthdayDto

      const profile = await this.findProfileById(profileId)

      profile.birthday = new Date(birthday)

      await this.profileRepository.save(profile)

      return profile
     }

     async selectedLanguage(selectedLanguageDto: SelectedLanguageDto, profileId: string): Promise<Profile> {
        const languages = this.languagesService.getLanguages()
        const languageName = languages[selectedLanguageDto.selectedLanguage]
        const profile = await this.findProfileById(profileId)


        if(!languageName) {
          throw new NotFoundException(`Language with code ${selectedLanguageDto.selectedLanguage} not found`)
        }
        profile.languages = languageName
        await this.profileRepository.save(profile)

        return profile
     }

     async gender(genderDto: GenderDto, profileId: string) : Promise<Profile>{
      const { gender } = genderDto

      const profile = await this.findProfileById(profileId)

      profile.gender = gender

      await this.profileRepository.save(profile)

      return profile
     }

     async social(profileId: string, socialNetworksData: Partial<SocialNetworks>): Promise<SocialNetworks> {
      const profile =await this.profileRepository.findOne({ where: { profileId: profileId }, relations: ['socialNetworks'] });
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${profileId} not found`);
      }
      let socialNetworks;
      if (profile.socialNetworks) {
        socialNetworks = this.socialNetworksRepository.merge(profile.socialNetworks, socialNetworksData);
      } else {
        socialNetworks = this.socialNetworksRepository.create(socialNetworksData);
        profile.socialNetworks = socialNetworks;
        await this.profileRepository.save(profile);
      }
      await this.socialNetworksRepository.save(socialNetworks);
    
      return socialNetworks;
    } 

    async saveImage(file: Express.Multer.File, profileId: string): Promise<Profile>{
      try{ 
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
        

        const fileName = uploadResponse[0].name;
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;

        const profile = await this.findProfileById(profileId);
        profile.profilePicture =  url; 
        
        await this.profileRepository.save(profile);
        console.log(profile)
        return profile;
      }
      catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
    }

    
     async createProfile(createProfileDto: CreateProfileDto, ): Promise<Profile>{
       const { facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode, ...profileData } = createProfileDto;
       const socialNetworks = this.socialNetworksRepository.create({facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode})
       await this.socialNetworksRepository.save(socialNetworks)

       const profile = this.profileRepository.create({...profileData, socialNetworks})
       await this.profileRepository.save(profile);

   return profile;
   }

  }
 
 