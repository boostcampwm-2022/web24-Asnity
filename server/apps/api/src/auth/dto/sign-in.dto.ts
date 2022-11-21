import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(8)
  password: string;
}
