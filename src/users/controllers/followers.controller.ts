import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { FollowersService } from '../services/followers.service';
import { UsersService } from '../services/users.service';
import { User } from '../../typeorm';

@Controller('api/v1/follow')
export class FollowersController {
    constructor(
        private readonly followersService: FollowersService,
        private readonly userService: UsersService
    ) { }


    @Get()
    async getFollowedUsers(@Body('id') id: any) {
        const userId = id
        return this.followersService.getFollowedUsers(userId);
    }

    @Post(':id')
    async followUser(@Param('id') followedId: string, @Body('followerId') followerId: string) {
        return this.followersService.followUser(followerId, followedId);
    }

    @Get(':id')
    async isFollower(
        @Query('followedId') followedId: string, 
        @Body('followerId') followerId: string
      ) {
        return this.followersService.isFollower(followerId, followedId);
      }

}
