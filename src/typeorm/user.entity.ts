import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';


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
        default: 'false',
        name: 'activation_token'})
       activationToken: string;

      @Column({
        type: 'uuid',
        unique: true,
        name: 'reset_password_token',
        nullable: true,
      })
      resetPasswordToken: string;

      @CreateDateColumn({
        name: 'created_on'
      })
      createdOn: Date;

 
}