import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class userToSenderPipe implements PipeTransform {
  transform(dto): number {
    if (!dto.requestUserId) {
      throw new BadRequestException('Validation failed');
    }
    dto['senderId'] = dto.requestUserId;
    delete dto.requestUserId;

    return dto;
  }
}
