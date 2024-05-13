import { Controller, Query, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService} from "../services/profile.service";
import { Get, Post, Body } from '@nestjs/common'
import { LanguagesService } from "../services/languages.service";
import { LocationService } from "../services/location.service";
import { CreateProfileDto } from "../dtos/createProfile.dto";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../../users/services/users/users.service";

@ApiTags('profiles')
    @Controller('api/v1/profile')
    export class ProfileController {
        constructor(private readonly profileService: ProfileService, 
            private readonly languagesService: LanguagesService,
            private readonly locationService: LocationService,
            // private readonly userService: UsersService
            ){}


        @Get('languages')
        getLanguages(){
            return this.languagesService.getLanguages()
        }

        @Get('countries')
        getCountries(){
            return this.locationService.getCountries()
        }
  
        @Get('')
        getProfiles(){
            return this.profileService.getProfiles()
        }

        @Post('')
        @UseInterceptors(FileInterceptor('profilePicture'))
        async createProfile(@UploadedFile() profilePicture: Express.Multer.File , @Body() createProfileDto: CreateProfileDto) {

          const profile = await this.profileService.createProfile(createProfileDto)
          if (profilePicture) {
            await this.profileService.saveImage(profilePicture, profile.Id);
          }
          return profile;
        }

        @Get('state')
        getStates(@Query('country') country : string){
           return this.locationService.getStates(country);
        }


    } 