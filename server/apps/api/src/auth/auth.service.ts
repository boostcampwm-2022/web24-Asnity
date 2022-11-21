import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { UserRepository } from '@repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userRepository: UserRepository,
    private config: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    // 비밀번호 암호화
    const hash = await argon.hash(signUpDto.password);
    try {
      // DB에 계정 생성
      await this.userRepository.create({ ...signUpDto, password: hash, provider: 'ASNITY' });
    } catch (error) {
      // 아이디 중복시 에러 처리
      if (error.name === 'MongoServerError' && error.code === 11000)
        throw new ForbiddenException('아이디가 중복되었습니다.');
      throw new ForbiddenException('DB에 계정 생성 중 에러 발생');
    }
    // 회원가입 성공 응답
    return '회원가입 성공!';
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ id: signInDto.id });
    // DB에 아이디가 없으면 예외처리
    if (!user) throw new ForbiddenException('존재하는 아이디가 없습니다.');
    // 비밀번호가 일치하지 않으면 예외처리
    const isMatch = await argon.verify(user.password, signInDto.password);
    if (!isMatch) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }
    // accessToken, refreshToken 발행
    const accessToken = await this.signAccessToken(user._id, user.nickname);
    const refreshToken = await this.signRefreshToken(user._id);

    // DB에 refreshToken 업데이트
    this.userRepository.updateOne({ _id: user._id }, { refreshToken });

    return { accessToken, refreshToken };
  }

  async signAccessToken(_id: number, nickname: string): Promise<string> {
    const accessTokenPayload = {
      _id,
      nickname,
    };
    const accessToken = await this.jwt.signAsync(accessTokenPayload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return accessToken;
  }

  async signRefreshToken(_id: number): Promise<string> {
    const refreshTokenPayload = {
      _id,
    };
    const refreshToken = await this.jwt.signAsync(refreshTokenPayload, {
      expiresIn: '100hr',
      secret: this.config.get('JWT_SECRET'),
    });
    return refreshToken;
  }
}
