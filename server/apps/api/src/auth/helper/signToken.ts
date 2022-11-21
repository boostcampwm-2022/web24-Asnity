import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignToken {
  constructor(private jwt: JwtService, private config: ConfigService) {}
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
