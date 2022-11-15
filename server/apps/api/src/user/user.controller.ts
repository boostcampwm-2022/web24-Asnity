import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddFollowingDto } from '@user/dto/add-following.dto';
import { SucessRes } from '@utils/def';

@Controller('api/user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  getUsers() {
    const createUserDto: CreateUserDto = { id: 'mj', pw: 'mjpw' };
    this.usersService.createUser(createUserDto);
    return 'hello user';
  }

  @Post('following/:id')
  getFollower(@Param('id') id: string) {
    const myId = '6372fcf4cf6f605428fe45df';
    const addFollowingDto: AddFollowingDto = { myId, followId: id };
    this.usersService.addFollowing(addFollowingDto);
    return SucessRes;
  }

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   this.usersService.createUser(createUserDto);
  // }
}
