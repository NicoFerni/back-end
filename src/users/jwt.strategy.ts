import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from 'src/typeorm';
import { JwtPayload } from "./jwt-payload.interface";
import { UsersService } from "./services/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usersService: UsersService){
        super({
            secretOrKey: `${process.env.SECRET}`,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User>{
        const { email } = payload;
        const user = await this.usersService.findOneByEmail(email);
        
        if(!user){
            throw new UnauthorizedException();
        } 
        return user;
    }
}