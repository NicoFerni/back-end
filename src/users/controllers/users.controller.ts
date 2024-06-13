import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  Patch,
  ValidationPipe,
  Query,
  Headers,
  Param,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from 'src/users/dtos/login.dto';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('users')
@Controller('api/v1/user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ){}

  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }



  @Post('signin')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto)
  }

  @Post('activate')
  async activate(@Query() activateUserDto: ActivateUserDto) {
    return this.authService.activateUserDto(activateUserDto)
  }

  @Post('/email/verified')
  isVerified(@Headers('token') activo: number) {
    return this.authService.isVerified(activo)
  }

  @Patch('request-reset-password')
  requestResetPasswordDto(@Body() RequestResetPasswordDto: RequestResetPasswordDto): Promise<void> {
    return this.authService.requestResetPassword(RequestResetPasswordDto)
  }

  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}