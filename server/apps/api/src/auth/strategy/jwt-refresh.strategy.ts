import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(config: ConfigService, private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    console.log(payload);
    const refreshToken = req.cookies?.refreshToken;
    const user = await this.userRepository.findById(payload._id);
    if (!user) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }
    if (refreshToken !== user.refreshToken) {
      console.log('refreshToken : ', refreshToken);
      console.log('user.refreshToken : ', user.refreshToken);
      return false;
    }

    // TODO: accessToken 재발행 로직

    console.log('accessToken 재발행 필요');
    return 'accessToken';
  }
}
