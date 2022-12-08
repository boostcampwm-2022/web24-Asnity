import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommunityService } from '@api/src/community/community.service';
import { responseForm } from '@utils/responseForm';
import { JwtAccessGuard } from '@api/src/auth/guard';
import { ReceivedData } from '@custom/decorator/ReceivedData.decorator';

@Controller('api/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async crateCommunity(@ReceivedData() createCommunityDto) {
    createCommunityDto['managerId'] = createCommunityDto.requestUserId;
    delete createCommunityDto.requestUserId;

    const result = await this.communityService.createCommunity(createCommunityDto);
    return responseForm(200, result);
  }
}
