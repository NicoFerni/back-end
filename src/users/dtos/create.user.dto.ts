import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { DeleteDateColumn } from "typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  names: string;

  @IsNotEmpty()
  lastNames: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;


  @DeleteDateColumn()
  deletedAt: Date;

}
