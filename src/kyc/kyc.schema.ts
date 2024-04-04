import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { E_ADDRESS_DOC_TYPE, E_ID_DOC_TYPE } from './kyc.enum';
import { ObjectId } from 'mongodb';

export type KYCDocument = HydratedDocument<KYC>;

@Schema({ timestamps: true })
export class KYC extends BaseSchema {
  @ApiProperty({ example: 'Nigeria', description: 'Country of the user' })
  @Prop({ required: true })
  country: string;

  @ApiProperty({ example: 'user', description: 'Role of user' })
  @Prop({ required: true })
  id_document_type: E_ID_DOC_TYPE;

  @Prop({ required: false, type: Object })
  id_document: {
    public_id: string;
    url: string;
  };

  @ApiProperty({ example: 'user', description: 'Role of user' })
  @Prop({ required: true })
  address_document_type: E_ADDRESS_DOC_TYPE;

  @Prop({ required: false, type: Object })
  address_document: {
    public_id: string;
    url: string;
  };

  @Prop({ required: false, type: Object })
  cac_document: {
    public_id: string;
    url: string;
  };

  @Prop({ type: ObjectId, ref: 'User' })
  user: string;
}

export const KYCSchema = SchemaFactory.createForClass(KYC);

KYCSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
