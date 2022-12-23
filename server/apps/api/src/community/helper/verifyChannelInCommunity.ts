import { BadRequestException } from '@nestjs/common';

export const verifyChannelInCommunity = (community, channels) => {
  if (!community) {
    throw new BadRequestException('해당하는 커뮤니티의 _id가 올바르지 않습니다.');
  }
  Array.from(channels.keys()).forEach((channelId: string) => {
    if (!community.channels.includes(channelId)) {
      throw new BadRequestException('커뮤니티에 없는 비정상적인 채널이 존재합니다.');
    }
  });
};
