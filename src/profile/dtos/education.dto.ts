import { IsNotEmpty, IsString, IsIn } from "class-validator"

export class EducationDto{
    @IsNotEmpty()
    @IsString()
    @IsIn(['Universidad' , 'Otros'])
    estudios: string
}