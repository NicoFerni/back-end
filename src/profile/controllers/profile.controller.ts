import { Controller } from "@nestjs/common";
import { ProfileService } from "../services/profile.service";
import { Get } from '@nestjs/common'
import { LanguagesService } from "../services/languages.service";

    @Controller('api/v1/profile')
    export class ProfileController {
        constructor(private readonly profileService: ProfileService, 
            private readonly languagesService: LanguagesService,
            ){}


        @Get('languages')
        getLanguages(){
            return this.languagesService.getLanguages()
        }
    } 