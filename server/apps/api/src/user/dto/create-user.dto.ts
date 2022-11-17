import { IsEmail, IsIn, IsNotEmpty, IsString, Min } from 'class-validator';
import { PROVIDER } from '@utils/def';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  @IsIn(PROVIDER)
  provider: 'ASNITY' | 'GITHUB';
}
