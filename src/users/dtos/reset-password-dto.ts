import { IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class ResetPasswordDto{

    @IsNotEmpty()
    resetPasswordToken: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(22)
    newPassword: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(22)
    repeatPassword: string
}