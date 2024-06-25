import { IsNotEmpty, IsEmail } from "class-validator"

export  class ResendCodeDto{

    @IsNotEmpty()
    @IsEmail()
    email: string

}