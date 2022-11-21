import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FollowerDto } from '@user/dto/follower.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { responseForm } from '@utils/responseForm';
import { ObjectIdValidationPipe } from '@custom_pipe/mongodbObjectIdValidation.pipe';
import { ModifyUserDto } from '@user/dto/modify-user.dto';

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
      const myId = '63786b635d4f08bbe0c940de';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const addFollowingDto: FollowerDto = { myId, followId: id };
      const result = await this.userService.toggleFollowing(addFollowingDto);
      return responseForm(200, result);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      // res.status(400).json(error.response);
      throw error;
    }
  }

  @Get('followers')
  async getFollowers() {
    try {
      const _id = '63786b635d4f08bbe0c940dc';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const result = await this.userService.getRelatedUsers(_id, 'followers');
      return responseForm(200, { followers: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get('followings')
  async getFollowings() {
    try {
      const _id = '63739b643969101c3fec884';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      const result = await this.userService.getRelatedUsers(_id, 'followings');
      return responseForm(200, { followings: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response ?? error));
      throw error;
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const result = await this.userService.getUser(id);
      return responseForm(200, { result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch('settings')
  async modifyUserSetting(@Body() modifyUserDto: ModifyUserDto) {
    try {
      const _id = '63786b635d4f08bbe0c940de';
      // TODO: Request Header에서 access token으로 현재 사용자 알아내기
      await this.userService.modifyUser({ ...modifyUserDto, _id });
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   this.usersService.createUser(createUserDto);
  // }
}
