import { IsNotEmpty, IsString, IsIn } from "class-validator";

export class GenderDto{

    @IsNotEmpty()
    @IsString()
    @IsIn(['Femenino', 'Masculino'])
    gender: string;
}