import { IsNotEmpty, MinLength, MaxLength, IsEmail, isUUID, IsUUID } from "class-validator";


export class LoginDto{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(22)
    password: string;
  
}