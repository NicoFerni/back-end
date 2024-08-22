import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User{
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
        default: 'false'})
      active: boolean;
      
      @Column({
        default: '',
        name: 'activation_token'})
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
      resetTokenExpiration : number;


      @Column({
        type: 'bigint',
        name: 'activate_token_expiration',
        nullable: true,
      })
      activationTokenExpiration : number;


      @CreateDateColumn({
        name: 'created_on',
      })
      createdOn: Date;

      @Column({
        type: 'boolean',
        name: 'has_profile',
        default: false
      })
      hasProfile: boolean

      @OneToOne(() => Profile)
      @JoinColumn() 
      profile: Profile;
 
}