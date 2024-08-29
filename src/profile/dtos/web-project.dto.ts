import { Role } from "../../typeorm/profile-web-project";



export class WebProjectDto {
    id: number
    url: string;
    initialDate: Date;
    endDate: Date;
    type: string;
    role: Role[];
    description: string;
    profile_id: string;
    images: string[]
  }