import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { now, ObjectId } from 'mongoose';

export class BaseSchema {
  @ApiProperty({ example: '641cde26cbf530b653fefe5a', description: 'Id' })
  _id: ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ example: 'date', description: 'Date of deletion' })
  @Prop({ default: null })
  deletedAt: Date;

  @ApiProperty({ example: 'date', description: 'Date of creation' })
  @Prop({ default: now() })
  createdAt: Date;

  @ApiProperty({ example: 'date', description: 'Date of update' })
  @Prop({ default: now() })
  updatedAt: Date;
}
