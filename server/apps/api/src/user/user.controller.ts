import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { FollowerDto, ModifyUserDto } from './dto';
import { RELATION } from '@user/helper/Relation';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('following/:followId')
  @UseGuards(JwtAccessGuard)
  async addFollowing(@ReceivedData() addFollowingDto: FollowerDto) {
    const result = await this.userService.toggleFollowing(addFollowingDto);
    return result;
  }

  @Get('followers')
  @UseGuards(JwtAccessGuard)
  async getFollowers(@Req() req: any) {
    const _id = req.user._id;
    const result = await this.userService.getRelatedUsers(_id, RELATION.FOLLOWERS);
    return { followers: result };
  }

  @Get('followings')
  @UseGuards(JwtAccessGuard)
  async getFollowings(@Req() req: any) {
    const _id = req.user._id;
    const result = await this.userService.getRelatedUsers(_id, RELATION.FOLLOWINGS);
    return { followings: result };
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyUserSetting(@ReceivedData() modifyUserDto: ModifyUserDto) {
    await this.userService.modifyUser(modifyUserDto);
    return { message: '사용자 정보 변경 완료' };
  }
}
