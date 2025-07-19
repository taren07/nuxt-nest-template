import { IsEmail, IsString, IsOptional, IsNumber, Min, Max, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Age must be a positive number' })
  @Max(150, { message: 'Age must be less than 150' })
  age?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}