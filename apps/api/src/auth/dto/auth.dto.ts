import { IsString, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
