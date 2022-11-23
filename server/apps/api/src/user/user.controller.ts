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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { responseForm } from '@utils/responseForm';
import { ObjectIdValidationPipe } from '@custom_pipe/mongodbObjectIdValidation.pipe';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { FollowerDto, ModifyUserDto } from './dto';

@Controller('api/user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private userService: UserService,
  ) {}

  @Post('following/:id')
  @UseGuards(JwtAccessGuard)
  async addFollowing(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    try {
      const myId = req.user._id;
      const addFollowingDto: FollowerDto = { myId, followId: id };
      const result = await this.userService.toggleFollowing(addFollowingDto);
      return responseForm(200, result);
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get('followers')
  @UseGuards(JwtAccessGuard)
  async getFollowers(@Req() req: any) {
    try {
      const _id = req.user._id;
      const result = await this.userService.getRelatedUsers(_id, 'followers');
      return responseForm(200, { followers: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Get('followings')
  @UseGuards(JwtAccessGuard)
  async getFollowings(@Req() req: any) {
    try {
      const _id = req.user._id;
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
      return responseForm(200, { users: result });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyUserSetting(@Body() modifyUserDto: ModifyUserDto, @Req() req: any) {
    try {
      const _id = req.user._id;
      await this.userService.modifyUser({ ...modifyUserDto, _id });
      return responseForm(200, {});
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
