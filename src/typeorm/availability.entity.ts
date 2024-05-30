import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Disponibilidad {

@PrimaryGeneratedColumn("uuid")
DisponibilidadId: string

@Column({
    nullable: false,
    default: 0,
    name: 'horas_semanales'
})
horasSemanales: number;

@Column(
    "varchar",
    {
    nullable: false,
    default: [],
    name: 'dias_disponibles'
})
diasDisponibles: string[];

 
@Column({
    nullable: false,
    default: '',
    name: 'activo'
})
  activo: string;

  @OneToOne(() => Profile, profile => profile.disponibilidad)
  @JoinColumn()
  profile: Profile;
}