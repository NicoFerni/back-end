import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('api/v1/user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,

  ) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Delete User by id' })
  @Delete('delete')
  deleteUser(@Body('id') id: string){
    return this.userService.deleteUser(id)
  }

  @ApiOperation({ summary: 'Get User by id' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}