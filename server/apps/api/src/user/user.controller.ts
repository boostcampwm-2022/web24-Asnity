import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { responseForm } from '@utils/responseForm';
import { ObjectIdValidationPipe } from '@custom_pipe/mongodbObjectIdValidation.pipe';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { FollowerDto, ModifyUserDto } from './dto';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('following/:id')
  @UseGuards(JwtAccessGuard)
  async addFollowing(@Param('id', ObjectIdValidationPipe) id: string, @Req() req: any) {
    const myId = req.user._id;
    const addFollowingDto: FollowerDto = { myId, followId: id };
    const result = await this.userService.toggleFollowing(addFollowingDto);
    return responseForm(200, result);
  }

  @Get('followers')
  @UseGuards(JwtAccessGuard)
  async getFollowers(@Req() req: any) {
    const _id = req.user._id;
    const result = await this.userService.getRelatedUsers(_id, 'followers');
    return responseForm(200, { followers: result });
  }

  @Get('followings')
  @UseGuards(JwtAccessGuard)
  async getFollowings(@Req() req: any) {
    const _id = req.user._id;
    const result = await this.userService.getRelatedUsers(_id, 'followings');
    return responseForm(200, { followings: result });
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyUserSetting(@Body() modifyUserDto: ModifyUserDto, @Req() req: any) {
    const _id = req.user._id;
    await this.userService.modifyUser({ ...modifyUserDto, _id });
    return responseForm(200, {});
  }
}
