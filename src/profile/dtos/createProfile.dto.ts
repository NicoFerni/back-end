import { isObject } from "class-validator";

export class CreateProfileDto {
  
  conocimientos: string[];
  idiomas: string;
  experiencia: string;
  precio: number;
  estudios: string;
  sexo: string;
  fotoDePerfil: string;
  descripcion: string;
  nacimiento: Date;

  
    pais: string;
    ciudad: string;
  

  horasSemanales:number;
  diasDisponibles: string[];
  activo: string

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
