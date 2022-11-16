import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { responseForm } from '@utils/responseForm';
import { Response } from 'Express';

@Controller('api/user/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return responseForm(200, { message: '회원가입 성공!' });
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signIn(signInDto);

    // refreshToken 쿠키에 구워줌
    res.cookie('refreshToken', result.refreshToken, {
      path: '/refresh',
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1시간 만료
    });

    return responseForm(200, { message: '로그인 성공!', accessToken: result.accessToken });
  }
}
