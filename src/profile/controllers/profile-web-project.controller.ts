import { Controller, Query, UseInterceptors, UploadedFile, Param, NotFoundException, Delete, Patch, UploadedFiles, BadRequestException } from "@nestjs/common";
import { ProfileService } from "../services/profile.service";
import { Get, Post, Body } from '@nestjs/common'
import { LanguagesService } from "../services/languages.service";
import { ApiTags } from "@nestjs/swagger";
import { TechnologiesService } from "../services/programingLanguagesList.service"
import { ProfileWebProjectService } from "../services/profile-web-project.service";


@ApiTags('Profile Web Project')
@Controller('api/v1/web')
export class ProfileWebProjectController {
  constructor(private readonly profileService: ProfileService,
    private readonly languagesService: LanguagesService,
    private readonly technologiesService: TechnologiesService,
    private readonly webProjectService: ProfileWebProjectService
  ) { }



  @Post('get-by-profile')
  async getWebByProfileId(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }
  
    return this.webProjectService.getWebByProfileId(id);
  }
  
}