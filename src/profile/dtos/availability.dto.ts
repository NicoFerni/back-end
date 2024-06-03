import { IsNotEmpty, IsIn, IsArray, ArrayMinSize, ArrayMaxSize, Min, Max, IsBoolean, IsString } from 'class-validator';

export class disponibilidadDto {
  @IsNotEmpty()
  @Min(1)
  @Max(70)
  horas: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsString({ each: true })
  @IsIn(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'], { each: true })
  dias: string[];


  @IsBoolean()
  activo: boolean;
}