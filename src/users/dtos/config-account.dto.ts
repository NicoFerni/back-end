import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ConfigAccountDto{

    names?: string
    lastNames?: string
    password?: string

    url?: string

    @IsNotEmpty()
    @IsEmail()
    email: string

}
