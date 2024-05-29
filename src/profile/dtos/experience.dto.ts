import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ExperienceDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Menos de 2 años', 'De 2 a 6 años', 'Más de 6 años'])
  experiencia: string;
}