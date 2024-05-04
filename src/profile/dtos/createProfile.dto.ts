export class CreateProfileDto {
  
  knowledge: string;
  languages: string;
  location: string;
  experience: string;
  price: number;
  education: string;
  gender: string;
  profilePicture: string;
  description: string;
  birthday: Date;

  weeklyHours:number;
  availableDays: string[];
  currentlyActive: string

  facebook: string;
  instagram: string;
  threads: string;
  twitter: string;
  reddit: string;
  linkedin: string;
  youtube: string;
  discord: string;
  whatsapp: string;
  github: string;
  areaCode: string;
}
