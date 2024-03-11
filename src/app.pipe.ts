import { ObjectId } from 'mongodb';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any): ObjectId {
    try {
      return ObjectId.createFromHexString(value);
    } catch (error) {
      throw new BadRequestException('Wrong Id provided');
    }
  }
}
