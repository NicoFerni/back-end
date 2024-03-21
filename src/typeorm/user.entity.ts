import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'user_id',
      })
      id: number;
    
      @Column({
        nullable: false,
        default: '',
        name: 'names'
      })
      nombres: string;
    
      @Column({
        nullable: false,
        default: '',
        name: 'last_name'
      })
      apellidos: string;
    
      @Column({
        nullable: false,
        default: '',
        name: 'password'
      })
      contraseña: string;

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
        type: 'uuid', 
        unique: true, 
        name:'activation_token'})
      activationToken: string

      @CreateDateColumn({name: 'created_on'})
      createdOn: Date;


}