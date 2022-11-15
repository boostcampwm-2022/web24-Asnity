import { Body, Controller, Get, Inject, LoggerService, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AddFollowingDto } from '@user/dto/add-following.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from '@schemas/user.schema';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { responseForm } from '@utils/responseForm';

@Controller('api/user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private userService: UserService,
  ) {}

  // @Get()
  // getUsers() {
  //   const createUserDto: CreateUserDto = { id: 'mj', pw: 'mjpw' };
  //   this.userService.createUser(createUserDto);
  //   return 'hello user';
  // }

  @Post('following/:id')
  async addFollowing(@Param('id') id: string) {
    try {
      const myId = '63734e98384f478a32c3a1cc';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const addFollowingDto: AddFollowingDto = { myId, followId: id };
      await this.userService.addFollowing(addFollowingDto);
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response;
    }
  }


  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   this.usersService.createUser(createUserDto);
  // }
}
