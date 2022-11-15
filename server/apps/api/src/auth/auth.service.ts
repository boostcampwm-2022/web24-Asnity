import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import * as argon from 'argon2';
import { UserRepository } from '@repository/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async signup(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.userRepository.signup(dto);
    } catch (error) {
      throw error;
    }
  }
}
