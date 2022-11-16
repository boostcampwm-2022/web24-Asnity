import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  provider: 'asnity' | 'github';
}
