import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import * as bcryptjs from 'bcryptjs'
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
      
  async createUser({nombres, apellidos, contraseña, email}: CreateUserDto) {
    const hashedPass = bcryptjs.hash(contraseña, 10)
    const existingUser = await this.userRepository.findOne( {where: { email: email }});

    if (existingUser) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
  }

    const newUser = this.userRepository.create({
      nombres,
      apellidos,
      email,
      contraseña: await hashedPass
    });
    return await this.userRepository.save(newUser);
  }
  
  getUsers() {
    return this.userRepository.find();
  }
      
}