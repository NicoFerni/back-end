import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { FollowersService } from '../services/followers.service';
import { Request } from 'express';
import { User } from '../../typeorm';

@Controller('api/v1/follow')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get()
  async getFollowedUsers(@Req() request: User) {
    const followerId = request.id;  // Suponiendo que `request.user.id` tiene el ID del usuario autenticado
    return this.followersService.getFollowedUsers(followerId);
  }

  @Get('/me')
  async getFollowers(@Req() request: User) {
    const userId = request.id;
    return this.followersService.getFollowers(userId);
  }

  @Get(':id')
  async isFollower(@Req() request: User, @Param('id') followedId: string) {
    const followerId = request.id;
    return this.followersService.isFollower(followerId, followedId);
  }

  @Post(':id')
  async followUser(@Req() request: User, @Param('id') followedId: string) {
    const followerId = request.id;
    return this.followersService.followUser(followerId, followedId);
  }

  @Delete(':id')
  async unfollowUser(@Req() request: User, @Param('id') followedId: string) {
    const followerId = request.id;
    return this.followersService.unfollowUser(followerId, followedId);
  }
}
