import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile, Profile_web_project } from "../../typeorm";
import { WebProjectDto } from "../dtos/web-project.dto";
import 'firebase/storage';
import { ProfileService } from "./profile.service";
import { app } from "../../firebase/firebase.config";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ProfileWebProjectService {
  constructor(
    @InjectRepository(Profile_web_project)
    private readonly webProjectRepository: Repository<Profile_web_project>,
    @InjectRepository(Profile)
    private readonly profileService: ProfileService,
  ) { }


  async getWebByProfileId(profileId: string) {
    const projects = await this.webProjectRepository.find({
      where: { profile: { Id: profileId } },
    });
  
    if (projects.length === 0) {
      return [];
    }
  
    return projects;
  }
  
  
  async saveImages(files: Express.Multer.File[], id: number): Promise<Profile_web_project> {
    try {
      const bucket = app.storage().bucket();
      const webProject = await this.webProjectRepository.findOne({ where: { id } });
  
      for (const file of files) {
        const uuid = uuidv4();
        const uploadResponse = await bucket.upload(file.path, {
          destination: `profile-picture/web-image/${file.originalname}`,
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        });
  
        const fileName = uploadResponse[0].name;
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
  
        webProject.images = webProject.images ? [...webProject.images, url] : [url];
      }
  
      await this.webProjectRepository.save(webProject);
      return webProject;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async createWebProfile(webProjectDto: WebProjectDto): Promise<Partial<Profile_web_project>> {
    const { profile_id, url, date , type, rol, description, images } = webProjectDto;
  
    const profile: Profile = await this.profileService.findProfileById(profile_id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    
    const webProject =  this.webProjectRepository.create({
      url,
      date,
      type,
      rol,
      description,
      images,
      profile: profile.Id, 
    });

    await this.webProjectRepository.save(webProject)

    
    return webProject
  }

}

