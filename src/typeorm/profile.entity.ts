import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { redes } from "./socialNetworks.entity";
import { disponibilidad } from "./availability.entity";

@Entity()
export class Profile {

  @PrimaryGeneratedColumn("uuid")
  Id: any

  @Column({
    nullable: false,
    default: '',
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
    nullable: false,
    default: '',
    name: 'ubicacion'
  })
  ubicacion: string

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
    name: 'genero'
  })
  genero: string;


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

  @OneToOne(() => disponibilidad, disponibilidad => disponibilidad.profile, { cascade: true })
  @JoinColumn()
  disponibilidad: disponibilidad;

  @OneToOne(() => redes, redes => redes.profile, { cascade: true, eager: true })
  @JoinColumn()
  redes: redes;

}