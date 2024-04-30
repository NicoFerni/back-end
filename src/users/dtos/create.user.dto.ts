import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsUUID } from "class-validator";
import { DeleteDateColumn } from "typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(28)
  names: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(29)
  lastNames: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsNotEmpty()
  // @IsUUID('4')
  // activationToken: any

  @DeleteDateColumn()
  deletedAt: Date;

}