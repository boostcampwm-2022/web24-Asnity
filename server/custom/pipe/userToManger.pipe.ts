import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class userToManagerPipe implements PipeTransform {
  transform(dto): number {
    if (!dto.requestUserId) {
      throw new BadRequestException('Validation failed');
    }
    dto['managerId'] = dto.requestUserId;
    delete dto.requestUserId;

    return dto;
  }
}
