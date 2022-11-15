import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Min(8)
  password: string;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  @Min(2)
  nickname: string;
}
