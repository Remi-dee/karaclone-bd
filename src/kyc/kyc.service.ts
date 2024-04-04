import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { KYC, KYCDocument } from './kyc.schema';
import * as cloudinary from 'cloudinary';
import { CreateKYCDTO } from './kyc.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(KYC.name) private readonly kycModel: Model<KYCDocument>,
  ) {}

  async createKYC(createKYCDTO: CreateKYCDTO, userId: string): Promise<KYC> {
    const {
      country,
      id_document_type,
      id_document,
      address_document_type,
      address_document,
      cac_document,
    } = createKYCDTO;

    // Define upload function
    const uploadDocumentToCloudinary = async (
      document: string,
      documentType: string,
    ): Promise<{ public_id: string; url: string; documentType: string }> => {
      const uniquePublicId = uuidv4(); // Generate unique public ID

      const uploadResult = await cloudinary.v2.uploader.upload(document, {
        public_id: uniquePublicId,
        folder: 'kyc_documents', // Changed folder name
        width: 150,
      });

      return {
        public_id: uploadResult.public_id,
        url: uploadResult.url,
        documentType: documentType,
      };
    };

    // Upload documents and get promises
    const uploadPromises = [];
    if (id_document) {
      uploadPromises.push(
        uploadDocumentToCloudinary(id_document, 'id_document'),
      );
    }
    if (address_document) {
      uploadPromises.push(
        uploadDocumentToCloudinary(address_document, 'address_document'),
      );
    }
    if (cac_document) {
      uploadPromises.push(
        uploadDocumentToCloudinary(cac_document, 'cac_document'),
      );
    }

    // Wait for all uploads to finish
    const uploadedDocuments = await Promise.all(uploadPromises);

    // Create KYC object with uploaded document details
    const newKYC = new this.kycModel({
      user: userId,
      country,
      id_document_type,
      id_document: uploadedDocuments.find(
        (doc) => doc.documentType === 'id_document',
      ),
      address_document_type,
      address_document: uploadedDocuments.find(
        (doc) => doc.documentType === 'address_document',
      ),
      cac_document: uploadedDocuments.find(
        (doc) => doc.documentType === 'cac_document',
      ),
    });

    // Save KYC record
    return await newKYC.save();
  }
}
