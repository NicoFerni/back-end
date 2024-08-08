import {
  Body,
  Controller,
  Post,
  UsePipes,
  Patch,
  ValidationPipe,
  Query,
  Headers,
  Get
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/users/dtos/login.dto';
import { User } from '../../typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import {  ResendCodeDto } from '../dtos/resend-code-dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
    private readonly authService: AuthService
) {}

@ApiOperation({ summary: 'Login Method'})
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Creates a new User'})
  @Post('signup')
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  
  @ApiOperation({ summary: 'Activate User via Email'})
  @Post('activate')
  async activate(@Query() activateUserDto: ActivateUserDto) {
    return this.authService.activateUserDto(activateUserDto)
  }

  @ApiOperation({ summary: 'Resend the activation code'})
  @Patch('resend-activation')
  async resend_activation(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendActivationCode(resendCodeDto)
  }

  @ApiOperation({ summary: 'Returns the status of the user, if is verified or not'})
  @Post('/email/verified')
  isVerified(@Headers('token') activo: string) {
    return this.authService.isVerified(activo)
  }

  @ApiOperation({ summary: 'Sent mail for password reset'})
  @Patch('request-reset-password')
  async requestResetPasswordDto(@Body() requestResetPasswordDto: RequestResetPasswordDto): Promise<void> {
    const { email } = requestResetPasswordDto
    await this.authService.requestResetPassword(email);
  }

  @ApiOperation({ summary: 'Method to change the password'})
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ activationToken: string }> {
    return this.authService.resetPassword(resetPasswordDto.resetPasswordToken, resetPasswordDto.newPassword, resetPasswordDto.repeatPassword);
  }

  @ApiOperation({ summary: 'Return the activation Token'})
  @Get('token')
  async getActivationToken(@Headers('Activation-Token') activationToken: string) {
      return this.authService.getActivationToken(activationToken)
  }

}