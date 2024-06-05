import { Injectable, HttpException, HttpStatus, UnauthorizedException, UnprocessableEntityException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from 'src/users/dtos/login.dto';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/jwt-payload.interface';
import { v4 } from 'uuid'
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import * as nodemailer from 'nodemailer';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    private jwtService: JwtService
  ) {}

  async findById(id: string){
    return this.userRepository.findOne({where : {id: id}})
  }
      
  async createUser({names, lastNames, password, email}: CreateUserDto) {
    const hashedPass = await this.hashPassword(password)
    const existingUser = await this.userRepository.findOne( {where: { email: email }});
    const token = v4()

    if (existingUser) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
  }
    const newUser = this.userRepository.create({
      names: names.charAt(0).toUpperCase + names.slice(1),
      lastNames: lastNames.charAt(0).toUpperCase + names.slice(1),
      email,
      password: hashedPass,
      activationToken: token,
      hasProfile: false,
    });
    await this.userRepository.save(newUser);
    this.sendMailActivation(newUser.email, newUser.activationToken);

    return(
     'Account created successfully'
    )
    
  }

  async sendMailActivation(email: string, activationToken: string) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })
    let mailOptions = {
      from:`Nicolas Fernandez ${process.env.EMAIL}`,
      to: email,
      subject: 'Esto es una prueba',
      text: `Activa tu cuenta con el siguiente codigo ${activationToken}`
    }
     await transporter.sendMail(mailOptions, function(error: string, info: any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent');
      }
    })
  }
  
  async findOneByEmail(email: string): Promise<User> {
    const user:User =  await this.userRepository.findOne({ where: { email } });

    if(!user){
      throw new NotFoundException(`User with email ${email} not found`)
    }
    return user;
  }
  
  async checkPassword(password: string, userPassword:string): Promise<boolean>{
    return await bcryptjs.compare(password, userPassword)
  }

  async login(loginDto: LoginDto): Promise<{accessToken: string, profile: boolean, id: string}>{
    const { email, password } = loginDto;
    const user:User = await this.findOneByEmail(email)
    
    if (await this.checkPassword(password, user.password)){
        const payload: JwtPayload = { id: user.id, email, activo: user.activo};
        const accessToken = await this.jwtService.sign(payload)
        return { 
          "accessToken": accessToken,
          "profile": user.hasProfile,
          "id": user.id
         }
      }
      throw new UnauthorizedException('Chequea tus credenciales')

    
    
  }

  async hashPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  async activateUser(user:User): Promise<void>{
    user.activo = true;
    this.userRepository.save(user);
  }

  async findOneInactivoByIdAndActivationToken(
    email: string,
    code: string): Promise<User>{
    return this.userRepository.findOne({ where : {email: (email), activationToken: code, activo: false }})
  }
  

  async activateUserDto(activateUserDto: ActivateUserDto): Promise<ActivateUserDto>{
    const { email, code } = activateUserDto;
    const user: User = await this.findOneInactivoByIdAndActivationToken(email, code)
  
    if(!user){
      throw new UnprocessableEntityException('This action cannot be done ')
    } 
    await this.activateUser(user)

    return {email, code}

  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto): Promise<void>{
    const { email } = requestResetPasswordDto;
    const user:User = await this.findOneByEmail(email)
    user.resetPasswordToken = v4()
    this.userRepository.save(user)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise <void> {
    const { resetPasswordToken, password } = resetPasswordDto;
    const user:User = await this.findOneByResetPasswordToken(resetPasswordToken)

    user.password = await this.hashPassword(password);
    user.resetPasswordToken = null;
    this.userRepository.save(user)
  }

  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { resetPasswordToken } })

    if(!user){
      throw new NotFoundException
    } 
    return user
  }

  async isVerified(activationToken: string){

    const user: User = await this.userRepository.findOne({where: {activationToken}})

    if(user.activo === true){
      return {
        "Verified" : true
      }
    }
    return {
      "Verified" : false
    }
  }

  

  getUsers() {
    return this.userRepository.find();
  }

}

