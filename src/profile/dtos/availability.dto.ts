import { IsString, IsNotEmpty, IsIn, IsArray, ArrayMinSize, ArrayMaxSize, Min, Max } from 'class-validator';

export class disponibilidadDto {
  @IsNotEmpty()
  @Min(1)
  @Max(70)
  horasSemanales: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], { each: true })
  diasDisponibles: string[];

  @IsString()
  @IsIn(['SI', 'NO'])
  activo: string;
}