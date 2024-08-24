import { Controller, Query, UseInterceptors, UploadedFile, Param, NotFoundException, Delete, Patch } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from "../services/profile.service";
import { Get, Post, Body } from '@nestjs/common'
import { LanguagesService } from "../services/languages.service";
import { LocationService } from "../services/location.service";
import { CreateProfileDto } from "../dtos/createProfile.dto";
import { ApiTags } from "@nestjs/swagger";
import { TechnologiesService } from "../services/programingLanguagesList.service"
import { Profile } from "../../typeorm";
import { RedesDto } from "../dtos/socialNetwork.dto";
import { ApiOperation } from "@nestjs/swagger";
import { isUUID } from "class-validator";

@ApiTags('Profiles')
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly languagesService: LanguagesService,
    private readonly locationService: LocationService,
    private readonly technologiesService: TechnologiesService
  ) { }

  
  @Get('languages')
  getLanguages() {
    return this.languagesService.getLanguages()
  }

  @ApiOperation({ summary: 'Delete Profile by id' })
  @Delete('delete')
  deleteProfile(@Body('id') id: string){
    return this.profileService.deleteProfile(id)
  }

  @Get('')
  getProfiles(): Promise<Profile[]> {
    return this.profileService.getProfiles()
  }


  @Post('')
  @UseInterceptors(FileInterceptor('fotoDePerfil'))
  async createProfile(@UploadedFile() fotoDePerfil: Express.Multer.File, @Body() createProfileDto: CreateProfileDto, @Query('userId') userId: string, @Body() redesDto: RedesDto) {

    const profile = await this.profileService.createProfile(createProfileDto, userId, redesDto)
    if (fotoDePerfil) {
      await this.profileService.saveImage(fotoDePerfil, profile.Id);
    }
    return profile;
  }

  @Patch('modify-profile')
  @UseInterceptors(FileInterceptor('fotoDePerfil'))
  async modifyProfile(@UploadedFile() fotoDePerfil: Express.Multer.File, @Body() createProfileDto: CreateProfileDto, @Query('userId') userId: string, @Body() redesDto: RedesDto) {
    const profile = await this.profileService.modifyProfile(createProfileDto, userId, redesDto)
    if (fotoDePerfil) {
      await this.profileService.saveImage(fotoDePerfil, profile.Id);
    }
    return profile;
  }

  @Get('tech')
  getTechnologies() {
    return this.technologiesService.getTechnologies()
  }

  @Get(':param')
  async findProfile(@Param('param') param: string) {
    let profile: Profile;

    if (isUUID(param)) {
      profile = await this.profileService.findProfileById(param);
    } else {
      profile = await this.profileService.findProfileByUrl(param);
    }
    if (!profile) {
      throw new NotFoundException(`Profile not found for ${param}`);
    }
    return profile;
  }


} 