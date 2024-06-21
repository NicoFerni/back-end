import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    code: string;
}