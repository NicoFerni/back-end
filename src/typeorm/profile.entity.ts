import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { SocialNetworks } from "./socialNetworks.entity";
import { User } from "./user.entity";

@Entity()
export class Profile {

     @PrimaryGeneratedColumn("uuid")
     profileId: any

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
        enum: ['Menos de 2 años', 'De 2 a 6 años', 'Más de 6 años'],
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
        name: 'birthday'
      })
      birthday: Date;

      @Column({
        nullable: false,
        default: '',
        name: 'profile_picture'
      })
      profilePicture: string;

      // @Column({
      //   nullable: true,
      //   default: '',
      //   name: 'social_networks'
      // })
      // socialNetworks: object;

      @Column({
        nullable: false,
        default: '',
        name: 'description'
      })
      description: string;

      @OneToOne(() => User, (user) => user.profile)
      user: User;

      @OneToOne(() => SocialNetworks, socialNetworks => socialNetworks.profile, { cascade: true, eager: true })
      @JoinColumn()
      socialNetworks: SocialNetworks;

}