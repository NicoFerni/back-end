import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('users')
@Controller('api/v1/user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ){}

  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }


  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}