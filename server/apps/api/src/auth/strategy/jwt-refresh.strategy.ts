import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@repository/user.repository';
import { SignToken } from '@api/src/auth/helper/signToken';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    config: ConfigService,
    private userRepository: UserRepository,
    private signToken: SignToken,
  ) {
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
    const refreshToken = req.cookies?.refreshToken;
    const user = await this.userRepository.findById(payload._id);
    if (!user) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('refreshToken이 일치하지 않습니다.');
    }

    const accessToken = await this.signToken.signAccessToken(user._id, user.nickname);

    return accessToken;
  }
}
