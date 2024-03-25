import { Injectable, HttpException, HttpStatus, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from 'src/users/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/jwt-payload.interface';
import { v4 } from 'uuid'
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import * as nodemailer from 'nodemailer';
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
      
  async createUser({names, lastNames, password, email}: CreateUserDto) {
    const hashedPass = await bcryptjs.hash(password, 10)
    const existingUser = await this.userRepository.findOne( {where: { email: email }});
    const token = v4()

    if (existingUser) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
  }

    const newUser = this.userRepository.create({
      names,
      lastNames,
      email,
      password: await hashedPass,
      activationToken:token,
    });
    await this.userRepository.save(newUser);
    this.sendMailActivation(newUser.email, newUser.activationToken);

    return newUser;
    
  }

  async sendMailActivation(email: string, activationToken: string) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'vallie59@ethereal.email',
        pass: 'c8sRyZkSVrZ5K3nk26'
      }
    })
    let mailOptions = {
      from: 'vallie59@ethereal.email',
      to: email,
      subject: 'Esto es una prueba',
      text: `Activa tu cuenta con el siguiente codigo ${activationToken}`
    }
    transporter.sendMail(mailOptions, function(error: string, info: any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }

  
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  
  async checkPassword(password: string, userPassword:string): Promise<boolean>{
    return await bcryptjs.compare(password, userPassword)
  }

  async login(loginDto: LoginDto): Promise<{accessToken: string}>{
    const { email, password } = loginDto;
    const user = await this.findOneByEmail(email)
    
    if(
      user && 
      (await this.checkPassword(password, user.password))){
        const payload: JwtPayload = { id: user.id, email, active: user.active};
        const accessToken = await this.jwtService.sign(payload)
        return { accessToken }
      }
      throw new UnauthorizedException('Chequea tus credenciales')
    
  }

  async activateUser(user:User): Promise<void>{
    user.active = true;
    this.userRepository.save(user);
  }

  async findOneInactiveByIdAndActivationToken(
    id: string,
    code: string): Promise<User>{
    return this.userRepository.findOne({ where : {id: (id), activationToken: code, active: false }})
  }
  

  async activateUserDto(activateUserDto: ActivateUserDto): Promise<void>{
    const { id, code } = activateUserDto;
    const user: User = await this.findOneInactiveByIdAndActivationToken(id, code)
  
    if(!user){
      throw new UnprocessableEntityException('This action cannot be done ')
    } 
    await this.activateUser(user)
  }

  getUsers() {
    return this.userRepository.find();
  }

}

