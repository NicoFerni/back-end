import { Role } from "../../typeorm/profile-web-project";



export class WebProjectDto {
    id: number
    url: string;
    date: string;
    type: string;
    rol: Role[];
    description: string;
    profile_id: string;
    images: string[]
  }