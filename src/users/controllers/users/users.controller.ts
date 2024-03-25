import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
    } from '@nestjs/common';
    import { UsersService } from 'src/users/services/users/users.service';
    import { CreateUserDto } from 'src/users/dtos/createUser.dto';
    import { LoginDto } from 'src/users/dtos/login.dto';
import { ActivateUserDto } from 'src/users/dtos/activate.user.dto';


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

      @Post('signin')
      login(@Body() loginDto: LoginDto) : Promise<{accessToken: string}>{
        return this.userService.login(loginDto)
      }

      @Post('activate')
      async activate(@Body() activateUserDto: ActivateUserDto){
        return this.userService.activateUserDto(activateUserDto)
      }
      
  
    }