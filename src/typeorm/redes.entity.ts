import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class Redes {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  threads: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  reddit: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  areaCode: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  github: string;

  @OneToOne(() => Profile, profile => profile.redes)
  profile: Profile;

}
