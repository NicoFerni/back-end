import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, Redes } from "src/typeorm";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { HttpModule } from "@nestjs/axios";
import { LanguagesService } from "./services/languages.service";
import { LocationService } from "./services/location.service";
import { MulterModule } from "@nestjs/platform-express";
//import { Disponibilidad } from "../typeorm/availability.entity";
import { TechnologiesService } from "./services/programingLanguagesList.service";


@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, Redes]), 
              HttpModule,
              MulterModule.register({
                dest: './uploads',
                   }),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, LanguagesService, LocationService, Redes, TechnologiesService],
})
export class ProfileModule {}