import {
    Body,
    Controller,
    Get,
    Post,
    UsePipes,
    ValidationPipe,
    } from '@nestjs/common';

    import { UsersService } from 'src/users/services/users/users.service';
    import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';

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
    }