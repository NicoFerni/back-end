import {
    Body,
    Controller,
    Patch
  } from '@nestjs/common';
  import { UsersService } from 'src/users/services/users.service';
  import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigAccountDto } from '../dtos/config-account.dto';

  @ApiTags('Users')
  @Controller('api/v1/configuration')
  export class ConfigController {
    constructor(
      private readonly userService: UsersService,
    ) { }
  
    @Patch('/account')
    changeInfo(@Body() configAccountDto: ConfigAccountDto) {
      return this.userService.changeInfo(configAccountDto);
    }

  }