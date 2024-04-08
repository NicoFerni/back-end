import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/typeorm";
import { Repository } from "typeorm";
import { HttpService } from '@nestjs/axios';
import { LanguagesService } from "./languages.service";
import { LocationService } from "./location.service";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>, 
        private readonly languagesService: LanguagesService,
        private readonly locationService: LocationService,
        private httpService: HttpService
    ) {}


    async getLanguages() {
      return this.languagesService.getLanguages()
    }

    async getLocation() {
      return this.locationService.getCountries()
    }

  }
