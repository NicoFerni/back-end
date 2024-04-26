import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, SocialNetworks } from "src/typeorm";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { HttpModule } from "@nestjs/axios";
import { LanguagesService } from "./services/languages.service";
import { LocationService } from "./services/location.service";
import { MulterModule } from "@nestjs/platform-express";


@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, SocialNetworks]), 
              HttpModule,
              MulterModule.register({
                dest: './uploads',
                   }),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, LanguagesService, LocationService, SocialNetworks],
})
export class ProfileModule {}