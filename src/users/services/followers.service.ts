import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "../../typeorm";
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
    const user = await this.userService.findById(followerId);
    if (!user) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    const followedUsers = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.following', 'following')
      .where('user.id = :id', { id: followerId })
      .getMany();

    return followedUsers.map((followed) => ({
      followedUser: followed.id,
      followedData: followed,
    }));
  }


  async followUser(followerId: string, followedId: string) {
    const follower = await this.userService.findById(followerId);
    if (!follower) {
        throw new NotFoundException(`User with ID ${followerId} not found`);
    }
    const followed = await this.userService.findById(followedId);
    if (!followed) {
        throw new NotFoundException(`User with ID ${followedId} not found`);
    }

    if (!follower.following) {
        follower.following = []; 
    }
    if (follower.following.some(user => user.id === followedId)) {
        throw new Error(`User with ID ${followerId} is already following user with ID ${followedId}`);
    }

    follower.following.push(followed);
    await this.userRepository.save(follower);
}

   
  async isFollower(followerId: string, followedId: string): Promise<boolean> {
    const follower = await this.userService.findById(followerId);
    if (!follower) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    const isFollowing = follower.following.some(user => user.id === followedId);
    return isFollowing;
  }
}
