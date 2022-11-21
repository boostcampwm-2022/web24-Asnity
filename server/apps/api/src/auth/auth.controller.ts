import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { responseForm } from '@utils/responseForm';
import { Response } from 'express';
import { getUserBasicInfo } from '@user/dto/user-basic-info.dto';
import { JwtAccessGuard, JwtRefreshGuard } from '@api/src/auth/guard';

@Controller('api/user/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return responseForm(200, { message: '회원가입 성공!' });
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken } = await this.authService.signIn(signInDto);

    // refreshToken 쿠키에 구워줌
    res.cookie('refreshToken', refreshToken, {
      path: '/api/user/auth/refresh',
      httpOnly: true,
      secure: false,
      maxAge: 360000000, // 100시간 만료
    });

    return responseForm(200, { message: '로그인 성공!', accessToken });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: any) {
    const accessToken = req.user;
    if (accessToken === null) {
      return responseForm(401, { message: '로그인 필요' });
    }
    return responseForm(200, { message: 'accessToken 재발행 성공!', accessToken });
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async getMyInfo(@Req() req: any) {
    return getUserBasicInfo(req.user);
  }
}
