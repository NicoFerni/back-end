
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

  disponibilidad:{
  horas:string;
  dias: string[];
  activo: boolean
  }

  redes:{
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
}
