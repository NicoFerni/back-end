import { Injectable, NotFoundException } from "@nestjs/common";
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


    async findProfileById(id:any): Promise<Profile>{
      const profile = await this.profileRepository.findOne(id);
      if (!profile) {
        throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
      }
      return profile;
    }


    async getLanguages() {
      return this.languagesService.getLanguages()
    }

    async getLocation() {
      return this.locationService.getCountries()
    }

    async availability(availabilityDto: AvailabilityDto, id: any ) {
       const { weeklyHours, availableDays, currentlyActive } = availabilityDto
       this.profileRepository.findOne({ where : {id:(id) }})

       const profile = await this.profileRepository.findOne(id);
       if (!profile) {
         throw new NotFoundException(`Profile with ID ${id} not found`);
       }
     }

    async experience(experienceDto: ExperienceDto, id: any) : Promise<Profile>{
        const { experience } = experienceDto
        const profile = await this.findProfileById(id)

        profile.experience = experience
        await this.profileRepository.save(profile)

        return profile
     }

     async education(educationDto: EducationDto, id:any) : Promise<Profile>{
      const { education } = educationDto
      const profile = await this.findProfileById(id)

      profile.education = education
      await this.profileRepository.save(profile)

      return profile
     }

     async birthday(birthdayDto: BirthdayDto, id: string) : Promise<Profile>{
      const { birthday } = birthdayDto

      const profile = await this.findProfileById(id)

      profile.birthday = new Date(birthday)

      await this.profileRepository.save(profile)

      return profile
     }

     async gender(genderDto: GenderDto, id: string) : Promise<Profile>{
      const { gender } = genderDto

      const profile = await this.findProfileById(id)

      profile.gender = gender

      await this.profileRepository.save(profile)

      return profile
     }

     async social(){

     }

     async description(){

     }
 
// Falta profile pick
  }
