import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import * as argon from 'argon2';
import { UserRepository } from '@repository/user.repository';
import { responseForm } from '@utils/responseForm';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async signup(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);
    try {
      await this.userRepository.create({ ...dto, password: hash });
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000)
        // 아이디 중복시 에러
        throw new ForbiddenException('아이디가 중복되었습니다.');
      throw error;
    }

    return responseForm(200, '회원가입 성공!');
  }
}
