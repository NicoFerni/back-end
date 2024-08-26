import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { RedesDto } from "../profile/dtos/socialNetwork.dto";

export class Disponibilidad {
  horas: string;
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

  @Column('simple-array', {
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
    default: ''
  })
  nacimiento: string;

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
  redes: RedesDto;

  @Column({
    nullable: true,
    name: 'user_id'
  })
  userId: string;

  @Column({
    nullable: true,
    name: 'profile_url'
  })
  profileUrl: string

}