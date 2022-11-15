import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { responseForm } from '@utils/responseForm';

@Controller('api/user/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const result = await this.authService.signUp(signUpDto);
      return responseForm(200, result);
    } catch (error) {
      throw error;
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignUpDto) {
    try {
      const result = await this.authService.signIn(signInDto);
      return responseForm(200, result);
    } catch (error) {
      throw error;
    }
  }
}
