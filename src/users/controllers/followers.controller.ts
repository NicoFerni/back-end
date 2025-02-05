import { BadRequestException, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
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
  async followUser(@Query('followerId') followerId: string, @Query('id') followedId: string) {
    return this.followersService.followUser(followerId, followedId);
  } 

  @Delete('/unfollow')
  async unfollowUser(
    @Query('followerId') followerId: string, 
    @Query('followedId') followedId: string
  ) {
    if (!followerId || !followedId) {
      throw new BadRequestException('followerId and followedId are required');
    }
    
    return this.followersService.unfollowUser(followerId, followedId);
  }
}
