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
      activo: boolean;
      
      @Column({
        default: 0,
        name: 'activation_token'})
       activationToken: number;

      @Column({
        type: 'uuid',
        unique: true,
        name: 'reset_password_token',
        nullable: true,
      })
      resetPasswordToken: string;

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