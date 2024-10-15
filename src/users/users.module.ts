 import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UsersService } from './services/users.service';
import { Profile } from 'src/typeorm/profile.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigController } from './controllers/config.controller';
import { FollowersController } from './controllers/followers.controller';
import { FollowersService } from './services/followers.service';



@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]),
  PassportModule.register({ defaultStrategy: 'jwt '}),
  JwtModule.register({
    secret: `${process.env.SECRET}`,
    signOptions: {
      expiresIn: 3600, 
    }
  }),],
  controllers: [UsersController, ConfigController, FollowersController],
  providers: [UsersService, AuthService, FollowersService],
  exports: [UsersService, AuthService, FollowersService],
})
export class UsersModule {}

