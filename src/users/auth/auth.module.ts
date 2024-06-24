import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm';

@Module({
    imports:[
        UsersModule,
        PassportModule, 
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt '}),
        JwtModule.register({
          secret: `${process.env.SECRET}`,
          signOptions: {
            expiresIn: 3600, 
          }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
