import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: any;

  @Column({
    nullable: false,
    default: '',
    name: 'names'
  })
  names: string;

  @Column({
    nullable: false,
    default: '',
    name: 'last_name'
  })
  lastNames: string;

  @Column({
    nullable: false,
    default: '',
    name: 'password'
  })
  password: string;

  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    type: 'boolean',
    default: 'false'
  })
  active: boolean;

  @Column({
    default: '',
    name: 'activation_token'
  })
  activationToken: string;

  @Column({
    unique: true,
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    type: 'bigint',
    name: 'reset_token_expiration',
    nullable: true,
  })
  resetTokenExpiration: number;


  @Column({
    type: 'bigint',
    name: 'activate_token_expiration',
    nullable: true,
  })
  activationTokenExpiration: number;


  @CreateDateColumn({
    name: 'created_on',
  })
  createdOn: Date;

  @Column({
    name: 'profile_url',
    default: '',
    nullable: true,
  })
  profileUrl: string

  @Column({
    type: 'boolean',
    name: 'has_profile',
    default: false
  })
  hasProfile: boolean

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  
  @ManyToMany(() => User, user => user.followers)
  @JoinTable({
    name: 'user_followers', 
    joinColumn: { name: 'follower_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followed_id', referencedColumnName: 'id' } 
  })
  following: User[];

  @ManyToMany(() => User, user => user.following)
  followers: User[];
}