import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { UsersService } from './services/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Profile } from 'src/typeorm/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile]),
  PassportModule.register({ defaultStrategy: 'jwt '}),
  JwtModule.register({
    secret: `${process.env.SECRET}`,
    signOptions: {
      expiresIn: 3600, 
    }
  })
],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}

