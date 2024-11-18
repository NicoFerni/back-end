import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { FollowersService } from '../services/followers.service';

@Controller('api/v1/follow')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}


  @Get()
  async getFollowedUsers(@Param('followerId') followerId: string) {
    return this.followersService.getFollowedUsers(followerId);
  }

  @Get('/me')
  async getFollowers(@Query('userId') userId: string) {
    return this.followersService.getFollowers(userId);
  }

  @Get(':id')
  async isFollower(@Param('followerId') followerId: string, @Param('id') followedId: string) {
    return this.followersService.isFollower(followerId, followedId);
  }

  @Post(':id')
  async followUser(@Param('followerId') followerId: string, @Param('id') followedId: string) {
    return this.followersService.followUser(followerId, followedId);
  }

  @Delete(':id')
  async unfollowUser(@Param('followerId') followerId: string, @Param('id') followedId: string) {
    return this.followersService.unfollowUser(followerId, followedId);
  }
}
