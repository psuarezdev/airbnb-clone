import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsDate
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  @IsOptional()
  emailVerified: Date;

  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString({ each: true })
  favoriteIds: string[];
}
