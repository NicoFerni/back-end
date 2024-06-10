import { IsNotEmpty } from 'class-validator';

export class BirthdayDto {
    @IsNotEmpty()
    nacimiento: string;
}
