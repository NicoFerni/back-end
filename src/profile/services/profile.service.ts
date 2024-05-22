import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, SocialNetworks, User } from "src/typeorm";
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
import { app } from "src/firebase/firebase.config";
import { v4 as uuidv4 } from 'uuid';
import { Availability } from "../../typeorm/availability.entity";
import { TechnologiesService } from "./programingLanguagesList.service";
import { SelectedTechnologiesDto } from "../dtos/selectedTechnologies.dto";


@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(Profile) 
        private readonly profileRepository: Repository<Profile>, 
        @InjectRepository(SocialNetworks)
        private readonly socialNetworksRepository: Repository<SocialNetworks>,
        @InjectRepository(Availability)
        private availabilityRepository: Repository<Availability>,
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

    async availability(availabilityDto: AvailabilityDto, Id: any ): Promise<Profile> {
       const { weeklyHours, availableDays, currentlyActive } = availabilityDto
       const profile = await this.findProfileById(Id)
      
       const availability = new Availability();
        availability.weeklyHours = weeklyHours;
        availability.availableDays = availableDays;
        availability.currentlyActive = currentlyActive;

        profile.availability = availability;

       await this.profileRepository.save(profile);

       return profile
     }

    async experience(experienceDto: ExperienceDto, Id: any) : Promise<Profile>{
        const { experience } = experienceDto
        const profile = await this.findProfileById(Id)

        profile.experience = experience
        await this.profileRepository.save(profile)

        return profile
     }

     async education(educationDto: EducationDto, Id:any) : Promise<Profile>{
      const { education } = educationDto
      const profile = await this.findProfileById(Id)

      profile.education = education
      await this.profileRepository.save(profile)

      return profile
     }

     async birthday(birthdayDto: BirthdayDto, Id: string) : Promise<Profile>{
      const { birthday } = birthdayDto

      const profile = await this.findProfileById(Id)

      profile.birthday = new Date(birthday)

      await this.profileRepository.save(profile)

      return profile
     }

     async selectedTech(selectedTechnologiesDto: SelectedTechnologiesDto, Id: string): Promise <object>{
      const technologies = this.programingLangaugesService.getTechnologies();
      const selectedTechnologies:any = {}
      const profile = await this.findProfileById(Id)
      
      for(const tech of selectedTechnologiesDto.selectedTechnologies){
        if(technologies[tech]){
          selectedTechnologies[tech] = technologies[tech]
        }
      }

      profile.knowledge = selectedTechnologies;
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
        profile.languages = languageName
        await this.profileRepository.save(profile)

        return profile
     }

     async gender(genderDto: GenderDto, Id: string) : Promise<Profile>{
      const { gender } = genderDto

      const profile = await this.findProfileById(Id)

      profile.gender = gender

      await this.profileRepository.save(profile)

      return profile
     }

     async social(Id: string, socialNetworksData: Partial<SocialNetworks>): Promise<SocialNetworks> {
      const profile =await this.profileRepository.findOne({ where: { Id: Id }, relations: ['socialNetworks'] });
      if (!profile) {
        throw new NotFoundException(`Profile with ID ${Id} not found`);
      }
      let socialNetworks: SocialNetworks;
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
    

        profile.profilePicture = url
  
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
       const { facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode, weeklyHours, availableDays, currentlyActive, ...profileData } = createProfileDto;
       
       const socialNetworks = this.socialNetworksRepository.create({facebook, instagram, threads, twitter, reddit, linkedin, youtube, discord, whatsapp, github, areaCode})
       const availability = this.availabilityRepository.create({weeklyHours, availableDays, currentlyActive})

       await this.availabilityRepository.save(availability)
       await this.socialNetworksRepository.save(socialNetworks)

     
       const user = await this.usersRepository.findOne({where: {id: userId }})
       if (!user) {
        throw new Error('User not found');
      }
       user.hasProfile = true
       await this.usersRepository.save(user);

       userId = user.id
     
       const profile = this.profileRepository.create({...profileData, socialNetworks, availability, userId})
       await this.profileRepository.save(profile);

   return profile;
   }

  }
 
 