import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Redes } from "./redes.entity";
import { Disponibilidad } from "./availability.entity";

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

  @Column({
    nullable: false,
    default: '',
    name: 'idiomas'
  })
  idiomas: string;

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
    default: 0,
    name: 'precio'
  })
  precio: number;

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
  userId: string;

  @OneToOne(() => Disponibilidad, disponibilidad => disponibilidad.profile, { cascade: true })
  @JoinColumn()
  disponibilidad: Disponibilidad;


  @OneToOne(() => Redes, redes => redes.profile, { cascade: true, eager: true })
  @JoinColumn()
  redes: Redes;

}