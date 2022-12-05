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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CommunityService } from '@api/src/community/community.service';
import { responseForm } from '@utils/responseForm';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { CreateCommunityDto, ModifyCommunityDto } from './dto';

@Controller('api/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async crateCommunity(@Body() createCommunityDto: CreateCommunityDto, @Req() req: any) {
    const managerId = req.user._id;
    const result = await this.communityService.createCommunity({
      managerId,
      ...createCommunityDto,
    });
    return responseForm(200, result);
  }
}
