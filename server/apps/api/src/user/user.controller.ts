import { Body, Controller, Delete, Get, Inject, LoggerService, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { followerDto } from '@user/dto/follower.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { responseForm } from '@utils/responseForm';
import { ObjectIdValidationPipe } from '@custom_pipe/mongodbObjectIdValidation.pipe';

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
      const addFollowingDto: followerDto = { myId, followId: id };
      await this.userService.addFollowing(addFollowingDto);
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response;
    }
  }

  @Delete('following/:id')
  async unFollowing(@Param('id') id: string) {
    try {
      const myId = '63734e98384f478a32c3a1cc';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const unFollowingDto: followerDto = { myId, followId: id };
      await this.userService.unFollowing(unFollowingDto);
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response;
    }
  }

  @Get(':id')
  async getUser(@Param('id', ObjectIdValidationPipe) _id: string) {
    try {
      const result = await this.userService.getUser(_id);
      return responseForm(200, { ...result });
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
