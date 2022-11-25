import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { responseForm } from '@utils/responseForm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ChannelService } from '@channel/channel.service';
import { CreateChannelDto, ModifyChannelDto } from '@channel/dto';
import { JwtAccessGuard } from '@auth/guard';

@Controller('api/channel')
export class ChannelController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private channelService: ChannelService,
  ) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req: any) {
    const _id = req.user._id;
    try {
      await this.channelService.createChannel({ ...createChannelDto, managerId: _id });
      return responseForm(200, { message: '채널 생성 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }

  @Patch('settings')
  @UseGuards(JwtAccessGuard)
  async modifyChannel(@Body() modifyChannelDto: ModifyChannelDto, @Req() req: any) {
    const _id = req.user._id;
    try {
      await this.channelService.modifyChannel({ ...modifyChannelDto, managerId: _id });
      return responseForm(200, { message: '채널 수정 성공!' });
    } catch (error) {
      this.logger.error(JSON.stringify(error.response));
      throw error;
    }
  }
}
