import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommunityService } from '@api/src/community/community.service';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';
import { userToManagerPipe } from '@custom/pipe/userToManger.pipe';
import { CreateCommunityDto } from '@community/dto';

@Controller('api/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async crateCommunity(@ReceivedData(userToManagerPipe) createCommunityDto: CreateCommunityDto) {
    const result = await this.communityService.createCommunity(createCommunityDto);
    return result;
  }
}
