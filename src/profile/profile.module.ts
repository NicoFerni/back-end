import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile } from "src/typeorm";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { HttpModule } from "@nestjs/axios";
import { LanguagesService } from "./services/languages.service";


@Module({
    imports: [TypeOrmModule.forFeature([User, Profile]), HttpModule],
    controllers: [ProfileController],
    providers: [ProfileService, LanguagesService],
})
export class ProfileModule {}