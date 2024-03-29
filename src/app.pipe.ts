import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any): ObjectId {
    try {
      if (typeof value === 'string') {
        return ObjectId.createFromHexString(value);
      } else if (Buffer.isBuffer(value)) {
        // Convert Buffer to hexadecimal string and create ObjectId
        const hexString = value.toString('hex');
        return ObjectId.createFromHexString(hexString);
      } else {
        throw new BadRequestException('Invalid ID format');
      }
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
  }
}
