import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { SocialNetworks } from "./socialNetworks.entity";
import { Availability } from "./availability.entity";

@Entity()
export class Profile {

  @PrimaryGeneratedColumn("uuid")
  Id: any

  @Column({
    nullable: false,
    default: '',
    name: 'knowledge'
  })
  knowledge: string;

  @Column({
    nullable: false,
    default: '',
    name: 'languages'
  })
  languages: string;

  @Column({
    nullable: false,
    default: '',
    name: 'location'
  })
  location: string

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
    name: 'birthday',
    type: 'date'
  })
  birthday: Date;

  @Column({
    nullable: true,
    default: '',
    name: 'profile_picture',
  })
  profilePicture: string;

  @Column({
    nullable: true,
    default: '',
    name: 'description'
  })
  description: string;

  @Column({
    nullable: true,
    name: 'user_id'
  })
  userId: string;

  @OneToOne(() => Availability, availability => availability.profile, { cascade: true })
  @JoinColumn()
  availability: Availability;

  @OneToOne(() => SocialNetworks, socialNetworks => socialNetworks.profile, { cascade: true, eager: true })
  @JoinColumn()
  socialNetworks: SocialNetworks;

}