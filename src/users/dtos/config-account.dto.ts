import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfigAccountDto{

    name?: string
    lastName?: string
    password?: string
    url?: string

    @IsNotEmpty()
    @IsEmail()
    email: string

}
