import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { Transform } from 'class-transformer';

export class Disponibilidad {
  horas: string;

  @Transform(({ value }) => JSON.stringify(value), { toClassOnly: true })
  @Transform(({ value }) => JSON.parse(value), { toPlainOnly: true })
  dias: String[];

  activo: boolean;
}

@Entity()
export class Profile {

  @PrimaryGeneratedColumn("uuid")
  Id: any

  @Column('simple-array',
    {
      nullable: false,
      default: [],
      name: 'conocimientos'
    })
  conocimientos: string[];

  @Column('simple-array',{
    nullable: false,
    default: [],
    name: 'idiomas'
  })
  idiomas: string[];

  @Column({
    type: 'json',
    nullable: false,
    default: {},
    name: 'ubicacion'
  })
  ubicacion: {
    pais: string;
    ciudad: string;
  };
  

  @Column({
    nullable: false,
    default: '',
    enum: ['Menos de 2 años', 'De 2 a 6 años', 'Más de 6 años'],
    name: 'experiencia'
  })
  experiencia: string;

  @Column({
    nullable: false,
    default: '',
    name: 'precio'
  })
  precio: string;

  @Column({
    nullable: false,
    default: '',
    name: 'estudios'
  })
  estudios: string;

  @Column({
    nullable: false,
    default: '',
    name: 'sexo'
  })
  sexo: string;


  @Column({
    nullable: false,
    name: 'nacimiento',
    type: 'date'
  })
  nacimiento: Date;

  @Column({
    nullable: true,
    default: '',
    name: 'fotoDePerfil',
  })
  fotoDePerfil: string;

  @Column({
    nullable: true,
    default: '',
    name: 'descripcion'
  })
  descripcion: string;

  @Column({
    nullable: true,
    name: 'user_id'
  })

  @Column({
    type: 'json',
    nullable: false,
    default: {},
    name: 'disponibilidad'
  })
  disponibilidad: Disponibilidad;

  @Column({
    type: 'json',
    nullable: false,
    default: {},
    name: 'redes'
  })
  redes: {
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
  };


  @Column({
    nullable: true,
    name: 'user_id'
  })
  userId: string;

}