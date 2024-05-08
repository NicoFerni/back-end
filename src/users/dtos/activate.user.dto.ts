import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class ActivateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsUUID('4')
    code: string;
}