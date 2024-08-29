import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, Profile_web_project } from "src/typeorm";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { HttpModule } from "@nestjs/axios";
import { LanguagesService } from "./services/languages.service";
import { LocationService } from "./services/location.service";
import { MulterModule } from "@nestjs/platform-express";
import { TechnologiesService } from "./services/programingLanguagesList.service";
import { ProfileWebProjectService } from "./services/profile-web-project.service";


@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, Profile_web_project]), 
              HttpModule,
              MulterModule.register({
                dest: './uploads',
                   }),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, LanguagesService, LocationService, TechnologiesService, ProfileWebProjectService],
})
export class ProfileModule {}