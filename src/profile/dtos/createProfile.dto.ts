export class CreateProfileDto {
  
  conocimientos: string[];
  idiomas: string;
  ubicacion: string;
  experiencia: string;
  precio: number;
  estudios: string;
  genero: string;
  fotoDePerfil: string;
  descripcion: string;
  nacimiento: Date;

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
