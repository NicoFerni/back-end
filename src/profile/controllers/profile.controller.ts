import { Controller, Query } from "@nestjs/common";
import { ProfileService} from "../services/profile.service";
import { Get, Post, Body } from '@nestjs/common'
import { LanguagesService } from "../services/languages.service";
import { LocationService } from "../services/location.service";
import { Profile } from "src/typeorm";
import { CreateProfileDto } from "../dtos/createProfile.dto";


    @Controller('api/v1/profile')
    export class ProfileController {
        constructor(private readonly profileService: ProfileService, 
            private readonly languagesService: LanguagesService,
            private readonly locationService: LocationService,
            ){}


        @Get('languages')
        getLanguages(){
            return this.languagesService.getLanguages()
        }

        @Get('countries')
        getCountries(){
            return this.locationService.getCountries()
        }
        
        @Post('')
        async create(@Body() createProfileDto:CreateProfileDto) : Promise <Profile>{
            return this.profileService.createProfile(createProfileDto);
        }

        @Get('state')
        getStates(@Query('country') country : string){
           return this.locationService.getStates(country);
        }


    } 