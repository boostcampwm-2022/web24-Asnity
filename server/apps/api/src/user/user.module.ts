import { Module } from '@nestjs/common';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '@repository/user.repository';
import { UsersController } from '@user/users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AuthModule],
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepository],
  exports: [MongooseModule],
})
export class UserModule {}
