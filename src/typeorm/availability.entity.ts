import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Disponibilidad {

    @PrimaryGeneratedColumn("uuid")
    Id: string

    @Column({
        nullable: false,
        default: 0,
        name: 'horas_semanales'
    })
    horas: number;

    @Column(
        "simple-array",
        {
            nullable: false,
            default: [],
            name: 'dias_disponibles'
        })
    dias: string[];


    @Column({
        nullable: false,
        default: false,
        name: 'activo'
    })
    activo: boolean;

    @OneToOne(() => Profile, profile => profile.disponibilidad)
    @JoinColumn()
    profile: Profile;
}