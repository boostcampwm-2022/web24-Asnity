import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  LoggerService,
  PipeTransform,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class ObjectIdValidationPipe implements PipeTransform {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      this.logger.error(JSON.stringify('MongoDB 올바른 사용자 _id 형식이 아닙니다.'));
      throw new BadRequestException('올바른 사용자 _id 형식이 아닙니다.');
    }
    return value;
  }
}
