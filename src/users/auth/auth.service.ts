import { Injectable, HttpException, HttpStatus, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/users/dtos/login.dto';
import { JwtPayload } from 'src/users/jwt-payload.interface';
import { v4 } from 'uuid';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from '../dtos/create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async createUser({names, lastNames, password, email}: CreateUserDto) {
    const hashedPass = await this.hashPassword(password)
    let existingUser = await this.userRepository.findOne( {where: { email: email }});


    if (existingUser && existingUser.activo === true) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
    }

    if (existingUser && existingUser.activo === false){
      const token = this.generateCode().toString();
      existingUser.names = names.charAt(0).toUpperCase() + names.slice(1);
      existingUser.lastNames = lastNames.charAt(0).toUpperCase() + lastNames.slice(1);
      existingUser.password = hashedPass;
      existingUser.activationToken = token;
    }else {
      const token = this.generateCode().toString();
      existingUser = this.userRepository.create({
        names: names.charAt(0).toUpperCase() + names.slice(1),
        lastNames: lastNames.charAt(0).toUpperCase() + lastNames.slice(1),
        email,
        password: hashedPass,
        activationToken: token,
        hasProfile: false,
        activo: false,
      });
    }
  
    await this.userRepository.save(existingUser);
    this.sendMailActivation(existingUser.email, existingUser.activationToken);
  
    return({
      'Activation Token': existingUser.activationToken
    });
  }

  async resendActivationCode(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email, activo: false } });
    if (!user) {
      throw new HttpException('No inactive account found with the provided email', HttpStatus.NOT_FOUND);
    }
    const newToken = this.generateCode().toString();
    user.activationToken = newToken;
  
    await this.userRepository.save(user);
    
    this.sendMailActivation(user.email, user.activationToken);
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
    });
    let mailOptions = {
      from: `Nicolas Fernandez ${process.env.EMAIL}`,
      to: email,
      subject: 'Activa tu cuenta',
      html: `<h2>Hola,</h2><p>Para crear tu cuenta en "Nombre de la página" necesitás confirmar tus datos a través del siguiente código:</p>, <h1>${activationToken}</h1> `,
    };
    await transporter.sendMail(mailOptions)
  
  }

  async checkPassword(password: string, userPassword: string): Promise<boolean> {
    return await bcryptjs.compare(password, userPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string, profile: boolean, id: string, activationToken: string }> {
    const { email, password } = loginDto;
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await this.checkPassword(password, user.password))) {
      throw new UnauthorizedException('Chequea tus credenciales');
    }

    const activationToken = user.activationToken;
    const payload: JwtPayload = { id: user.id, email, activo: user.activo };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      profile: user.hasProfile,
      id: user.id,
      activationToken
    };
  }

  async findOneInactivoByIdAndActivationToken(email: string, code: string): Promise<User> {
    return this.userRepository.findOne({ where: { email, activationToken: code, activo: false } });
  }
  
  async activateUser(user: User): Promise<string> {
    user.activo = true;
    await this.userRepository.save(user);
    return `Activation token: ${user.activationToken}`;
  }

  async activateUserDto(activateUserDto: ActivateUserDto): Promise<ActivateUserDto> {
    const { email, code } = activateUserDto;
    const user: User = await this.findOneInactivoByIdAndActivationToken(email, code);

    if (!user) {
      throw new UnprocessableEntityException('This action cannot be done');
    }
    await this.activateUser(user);

    return { email, code };
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto): Promise<void> {
    const { email } = requestResetPasswordDto;
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    user.resetPasswordToken = v4();
    await this.userRepository.save(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;
    const user: User = await this.userRepository.findOne({ where: { resetPasswordToken } });

    if (!user) {
      throw new NotFoundException(`User with reset token not found`);
    }

    user.password = await this.hashPassword(password);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }

  async isVerified(activationToken: string) {
    const user: User = await this.userRepository.findOne({ where: { activationToken } });

    if (!user) {
      throw new Error('User not found');
    }

    return { "Verified": user.activo };
  }
}
