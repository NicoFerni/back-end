import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FollowersService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getFollowedUsers(followerId: string) {
    const user = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following', 'following.profile'], 
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }
  
    return (user.following || []).map((followed) => ({
      followedUser: user,
      followedData: user.following,
    }));
  }

  async getFollowers(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.followers.map((follower) => ({
      followerUser: follower.id,
      followerData: follower,
    }));
  }

  async isFollower(followerId: string, followedId: string): Promise<{ following: boolean }> {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    const isFollowing = follower.following.some((user) => user.id === followedId);
    return { following: isFollowing };
  }

  async followUser(followerId: string, followedId: string) {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    const followed = await this.userRepository.findOne({
      where: { id: followedId },
    });

    if (!follower || !followed) {
      throw new NotFoundException(`User not found`);
    }

    if (follower.following.some((user) => user.id === followedId)) {
      throw new Error(`User with ID ${followerId} is already following user with ID ${followedId}`);
    }

    follower.following.push(followed);
    await this.userRepository.save(follower);
    return { message: 'Successfully followed user' };
  }

  async unfollowUser(followerId: string, followedId: string) {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    follower.following = follower.following.filter((user) => user.id !== followedId);
    await this.userRepository.save(follower);
    return { message: 'Successfully unfollowed user' };
  }
}
