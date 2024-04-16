import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, SocialNetworks } from "src/typeorm";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { HttpModule } from "@nestjs/axios";
import { LanguagesService } from "./services/languages.service";
import { LocationService } from "./services/location.service";


@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, SocialNetworks]), HttpModule],
    controllers: [ProfileController],
    providers: [ProfileService, LanguagesService, LocationService, SocialNetworks],
})
export class ProfileModule {}