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
    const existingUser = await this.userRepository.findOne( {where: { email: email }});
    const token = this.generateCode().toString()

    if (existingUser) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
  }
    const newUser = this.userRepository.create({
      names: names.charAt(0).toUpperCase() + names.slice(1),
      lastNames: lastNames.charAt(0).toUpperCase() + lastNames.slice(1),
      email,
      password: hashedPass,
      activationToken: token,
      hasProfile: false,
    });
    await this.userRepository.save(newUser);
    this.sendMailActivation(newUser.email, newUser.activationToken);

    return({
      'Activation Token': newUser.activationToken
    })
    
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
      html: `<h1>Bienvenido!</h1><p>Activa tu cuentacon el siguiente codigo: ${activationToken}</p>`,
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

  async activateUser(user: User): Promise<string> {
    user.activo = true;
    await this.userRepository.save(user);
    return `Activation token: ${user.activationToken}`;
  }

  async findOneInactivoByIdAndActivationToken(email: string, code: string): Promise<User> {
    return this.userRepository.findOne({ where: { email, activationToken: code, activo: false } });
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
