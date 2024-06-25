import { Injectable, HttpException, HttpStatus, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { LoginDto } from 'src/users/dtos/login.dto';
import { JwtPayload } from 'src/users/jwt-payload.interface';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from '../dtos/create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async createUser({ names, lastNames, password, email }: CreateUserDto) {
    const hashedPass = await this.hashPassword(password)
    let existingUser = await this.userRepository.findOne({ where: { email: email } });


    if (existingUser && existingUser.active === true) {
      throw new HttpException('El email registrado ya existe', HttpStatus.BAD_REQUEST);
    }

    if (existingUser && existingUser.active === false) {
      const token = this.generateCode().toString();
      existingUser.names = names.charAt(0).toUpperCase() + names.slice(1);
      existingUser.lastNames = lastNames.charAt(0).toUpperCase() + lastNames.slice(1);
      existingUser.password = hashedPass;
      existingUser.activationToken = token;
    } else {
      const token = this.generateCode().toString();
      existingUser = this.userRepository.create({
        names: names.charAt(0).toUpperCase() + names.slice(1),
        lastNames: lastNames.charAt(0).toUpperCase() + lastNames.slice(1),
        email,
        password: hashedPass,
        activationToken: token,
        hasProfile: false,
        active: false,
      });
    }

    await this.userRepository.save(existingUser);
    this.sendMailActivation(existingUser.email, existingUser.activationToken);

    return ({
      'Activation Token': existingUser.activationToken
    });
  }


  // async resendActivationCode(email: string): Promise<void> {
  //   const user: User = await this.userRepository.findOne({ where: { email: email } });
  //   const newToken = this.generateCode().toString();
  //   if (user) {
  //     user.activationToken = newToken;
  //     await this.userRepository.save(user);
  //     this.sendMailActivation(user.email, user.activationToken);
  //   }
  //   console.log(user.email, user.activationToken)
  //   console.log(user)
  //   console.log(newToken)
  // }



  async sendMailActivation(email: string, activationToken: string) {
    const link = `https://programadoresweb.netlify.app/`
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
      html: `<h2>Hola,</h2><p>Para crear tu cuenta en "Nombre de la página" necesitás confirmar tus datos a través del siguiente código:</p> <h1>${activationToken}</h1> <p>Ingresar a <a href=${link}>"Nombre de la web" y confirmar mi cuenta</p>`,
    };
    await transporter.sendMail(mailOptions)

  }

  async sendResetEmail(email: string, resetToken: string) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const resetLink = `https://programadoresweb.netlify.app/reset-password/${resetToken}`;

    let mailOptions = {
      from: `Nicolas Fernandez ${process.env.EMAIL}`,
      to: email,
      subject: 'Restablece tu contraseña',
      html: `<h3>Hola,</h3><p>Parece que estás intentado recuperar tu cuenta. Utiliza el siguiente enlace para cambiar tu contraseña</p> <a href="${resetLink}">Cambiar contraseña</a> <h4>Este enlace expirará en 48 horas.</h4>`,
    };

    await transporter.sendMail(mailOptions);
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
    const payload: JwtPayload = { id: user.id, email, activo: user.active };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      profile: user.hasProfile,
      id: user.id,
      activationToken
    };
  }

  async findOneInactiveByIdAndActivationToken(email: string, code: string): Promise<User> {
    return this.userRepository.findOne({ where: { email, activationToken: code, active: false } });
  }

  async activateUser(user: User): Promise<string> {
    user.active = true;
    await this.userRepository.save(user);
    return `Activation token: ${user.activationToken}`;
  }

  async activateUserDto(activateUserDto: ActivateUserDto) {
    const { email, code } = activateUserDto;
    const user: User = await this.findOneInactiveByIdAndActivationToken(email, code);

    if (!user || user.active === true) {
      throw new UnprocessableEntityException('This action cannot be done');
    }
    await this.activateUser(user);
    await this.sendMailActivation(user.email, user.activationToken)

    return {
      'id': user.id,
      'token': user.activationToken
    };
  }

  async requestResetPassword(email: string): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const resetPasswordToken = this.generateCode().toString();
    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 48);
    user.resetTokenExpiration = expirationDate
    user.resetPasswordToken = resetPasswordToken

    await this.userRepository.save(user);

    this.sendResetEmail(user.email, resetPasswordToken);
    throw new HttpException('Email sent', HttpStatus.OK);

  }

  async resetPassword(token: string, newPassword: string, repeatPassword: string): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetTokenExpiration: MoreThan(new Date())
      }
    });

    if (!user || (user.resetPasswordToken != token) || (user.resetPasswordToken === null)) {
      throw new NotFoundException('Invalid or expired password reset token');
    }
    if (newPassword != repeatPassword) {
      throw new UnauthorizedException('Passwords must be match')
    } else {
      user.password = await this.hashPassword(newPassword);
      user.resetPasswordToken = null;
      user.resetTokenExpiration = null;

      await this.userRepository.save(user);
      throw new HttpException('Password changed successfully', HttpStatus.OK);
    }
  }


  async isVerified(activationToken: string) {
    const user: User = await this.userRepository.findOne({ where: { activationToken } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { "Verified": user.active };
  }
}
