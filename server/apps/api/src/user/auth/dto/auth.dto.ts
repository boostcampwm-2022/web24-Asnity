import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(8)
  password: string;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  @Min(2)
  nickname: string;
}
