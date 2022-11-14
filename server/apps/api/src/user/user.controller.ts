import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../../../../dao/schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  getUsers() {
    const createUserDto: CreateUserDto = { id: 'ny', pw: 'nypw' };
    this.usersService.createUser(createUserDto);
    return 'hello user';
  }
  // @Get('followers/:id')
  // getFollowers(@Param('id') id: string): User[] {
  //   return this.usersService.getAllFollowers();
  // }

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   this.usersService.createUser(createUserDto);
  // }
}
