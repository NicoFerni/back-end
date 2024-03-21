import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { DeleteDateColumn } from "typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(28)
  nombres: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(29)
  apellidos: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  contraseña: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @DeleteDateColumn()
  deletedAt: Date;

}