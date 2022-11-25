import { Controller, Get, Inject, LoggerService, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { responseForm } from '@utils/responseForm';

@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private userService: UserService,
  ) {}

  @Get()
  async getUser(@Query('search') id: string) {
    try {
      const result = await this.userService.getUser(id);
      return responseForm(200, { users: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
