import { RedesDto } from "./socialNetwork.dto";

export class CreateProfileDto {
  
  conocimientos: string[];
  idiomas: string[];
  experiencia: string;
  precio: string;
  estudios: string;
  sexo: string;
  fotoDePerfil: string;
  descripcion: string;
  nacimiento: Date;

  pais: string;
  ciudad: string;

  
  horas:string;
  dias: Array<String>;
  activo: boolean

  redes: RedesDto
  // facebook: string;
  // instagram: string;
  // threads: string;
  // twitter: string;
  // reddit: string;
  // linkedin: string;
  // youtube: string;
  // discord: string;
  // whatsapp: string;
  // github: string;
  // areaCode: string;

}
