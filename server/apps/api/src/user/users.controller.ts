import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query('search') id: string) {
    const result = await this.userService.getUsers(id);
    return { users: result };
  }
}
