import { Body, Controller, Delete, Get, Inject, LoggerService, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { FollowerDto } from '@user/dto/follower.dto';
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
  async addFollowing(@Param('id', ObjectIdValidationPipe) id: string) {
    try {
      const myId = '63739b643969101c3fec8849';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const addFollowingDto: FollowerDto = { myId, followId: id };
      const result = await this.userService.toggleFollowing(addFollowingDto);
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response;
    }
  }

  // @Delete('following/:id')
  // async unFollowing(@Param('id', ObjectIdValidationPipe) id: string) {
  //   try {
  //     const myId = '63734e98384f478a32c3a1cc';
  //     // TODO: Request Header에서 access token으로 현재 사용자 알아내기
  //     const unFollowingDto: followerDto = { myId, followId: id };
  //     await this.userService.toggleFollowing(unFollowingDto);
  //     return responseForm(200, {});
  //   } catch (error) {
  //     this.logger.error(JSON.stringify(error.response));
  //     return error.response;
  //   }
  // }

  @Get('followers')
  async getFollowers() {
    try {
      const _id = '63734f4eca63eaf1876a2c3b';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const result = await this.userService.getRelatedUsers(_id, 'followers');
      return responseForm(200, { followers: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response ?? error;
    }
  }

  @Get('followings')
  async getFollowings() {
    try {
      const _id = '63739b643969101c3fec8849';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const result = await this.userService.getRelatedUsers(_id, 'followings');
      return responseForm(200, { followings: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      return error.response ?? error;
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
