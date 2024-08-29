import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

export enum Role {
    Backend = 'Backend',
    Frontend = 'Frontend',
    FullStack = 'FullStack'
  }

@Entity()
export class Profile_web_project {

  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('varchar', {
    nullable: false,
    name: 'url',
  })
  url: string

  @Column('varchar', {
    nullable: false,
    name: 'date',
    
  })
  date: string

  @Column('varchar', {
    nullable: true,
    name: 'type',
  })
  type: string

  @Column('enum', {
    enum: Role, 
    nullable: false,
    name: 'rol',
  })
  rol: Role[]

  @Column('varchar', {
    nullable: true,
    name: 'description',
  })
  description: string

  @Column('varchar', {
    nullable: true,
    name: 'images',
  })
  images: string[]

  @OneToOne(() => Profile, (profile) => profile.Profile_web_project)
  @JoinColumn({ name: 'profile_id' }) 
  profile: Profile;
}