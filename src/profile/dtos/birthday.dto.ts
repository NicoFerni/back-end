import { IsNotEmpty, IsDateString } from 'class-validator';

export class BirthdayDto {
    @IsNotEmpty()
    @IsDateString()
    nacimiento: Date;
}
