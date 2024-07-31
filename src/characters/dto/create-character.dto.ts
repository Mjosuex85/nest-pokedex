import { IsBooleanString, IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateCharacterDto {

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  birth_date: string;

  @IsBooleanString()
  death: string;

  
  createdAt: number;

  updatedAt: number;
  
}
