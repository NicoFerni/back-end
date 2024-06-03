
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
import { UsersService } from 'src/users/services/users/users.service';
import { LoginDto } from 'src/users/dtos/login.dto';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';
import { RequestResetPasswordDto } from 'src/users/dtos/request-reset-password.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password-dto';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
    @Controller('api/v1/user')
    export class UsersController {
      constructor(private readonly userService: UsersService) {}
      
      @Get('')
      getUsers() {
        return this.userService.getUsers();
      }
  
      @Post('signup')
      @UsePipes(ValidationPipe)
      createUsers(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
      }

      @Get(':id')
      findById(@Param('id') id: string) { 
        return this.userService.findById(id);
      }
    
      @Post('signin')
      login(@Body() loginDto: LoginDto) : Promise<{accessToken: string}>{
        return this.userService.login(loginDto)
      }

      @Post('activate')
      async activate(@Query() activateUserDto: ActivateUserDto){
        return this.userService.activateUserDto(activateUserDto)
      }
      
      @Post('/email/verified')
      isVerified(@Headers('token') activo: string){
        return this.userService.isVerified(activo)
      }

      @Patch('request-reset-password')
        requestResetPasswordDto(@Body() RequestResetPasswordDto: RequestResetPasswordDto): Promise<void> {
          return this.userService.requestResetPassword(RequestResetPasswordDto)
        }

      @Patch('reset-password')
        resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
          return this.userService.resetPassword(resetPasswordDto);
        }
      
    }