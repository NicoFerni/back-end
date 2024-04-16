import { IsString, IsNotEmpty, IsIn, IsArray, ArrayMinSize, ArrayMaxSize, Min, Max } from 'class-validator';

export class AvailabilityDto {
  @IsNotEmpty()
  @Min(1)
  @Max(70)
  weeklyHours: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], { each: true })
  availableDays: string[];

  @IsString()
  @IsIn(['SI', 'NO'])
  currentlyActive: string;
}