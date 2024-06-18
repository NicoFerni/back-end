import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/users/dtos/login.dto';
import { User } from '../../typeorm';
import { Repository } from 'typeorm';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { AuthService } from './auth.service';


@Controller('api/v1/auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
    private readonly authService: AuthService
) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  
}