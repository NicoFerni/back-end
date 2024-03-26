import { IsNotEmpty, MinLength, MaxLength, IsUUID } from "class-validator";

export class ResetPasswordDto{

    @IsNotEmpty()
    @IsUUID('4')
    resetPasswordToken: string;


    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(22)
    password: string;
}