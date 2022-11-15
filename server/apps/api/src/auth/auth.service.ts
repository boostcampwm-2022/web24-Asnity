import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { UserRepository } from '@repository/user.repository';
import { responseForm } from '@utils/responseForm';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async signUp(signUpDto: SignUpDto) {
    // 비밀번호 암호화
    const hash = await argon.hash(signUpDto.password);
    try {
      // DB에 계정 생성
      await this.userRepository.create({ ...signUpDto, password: hash });
    } catch (error) {
      // 아이디 중복시 에러 처리
      if (error.name === 'MongoServerError' && error.code === 11000)
        throw new ForbiddenException('아이디가 중복되었습니다.');
      throw error;
    }
    // 회원가입 성공 응답
    return responseForm(200, '회원가입 성공!');
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({ id: signInDto.id });
    // DB에 아이디가 없으면 예외처리
    if (!user) throw new ForbiddenException('존재하는 아이디가 없습니다.');
    // 비밀번호가 일치하지 않으면 예외처리
    const isMatch = await argon.verify(user.password, signInDto.password);
    if (!isMatch) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }
    // 로그인 성공 응답
    // To-do : accessToken, refreshToken 발행 필요
    return responseForm(200, '로그인 성공!');
  }
}
