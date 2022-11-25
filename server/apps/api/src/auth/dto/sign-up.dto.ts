import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Length(2, 8)
  nickname: string;
}
