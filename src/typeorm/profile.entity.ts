import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class Profile {

     @PrimaryGeneratedColumn("uuid")
     id: any

    @Column({
        nullable: false,
        default: '',
        name: 'knowledge'
      })
      knowledge: string;

      @Column({
        nullable: false,
        default: '',
        name: 'lenguages'
      })
      lenguages: string;

      @Column({
        nullable: false,
        default: '',
        name: 'location'
      })
      location: string

      @Column({
        nullable: false,
        default: '',
        name: 'availability'
      })
      availability: string;

      @Column({
        nullable: false,
        default: '',
        name: 'experience'
      })
      experience: string;

      @Column({
        nullable: false,
        default: 0,
        name: 'price'
      })
      price: number;

      @Column({
        nullable: false,
        default: '',
        name: 'education'
      })
      education: string;

      @Column({
        nullable: false,
        default: '',
        name: 'gender'
      })
      gender: string;

      @Column({
        nullable: false,
        default: '',
        name: 'profile_picture'
      })
      profilePicture: string;

      @Column({
        nullable: false,
        default: '',
        name: 'social_networks'
      })
      socialNetworks: string;

      @Column({
        nullable: false,
        default: '',
        name: 'description'
      })
      description: string;

      @OneToOne(() => User, (user) => user.profile)
      user: User;

}