import { Injectable } from '@nestjs/common';
import * as Paystack from 'paystack';

@Injectable()
export class PaystackService {
  private readonly paystack;

  constructor() {
    this.paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);
  }

  async initializeTransaction(amount: number, email: string): Promise<any> {
    const initializeTransactionRequest = {
      amount: amount * 100, // Paystack expects amount in kobo (1 Naira = 100 kobo)
      email,
    };
    try {
      const response = await this.paystack.transaction.initialize(
        initializeTransactionRequest,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error initializing transaction: ${error.message}`);
    }
  }

  async verifyTransaction(reference: string): Promise<any> {
    try {
      const response = await this.paystack.transaction.verify(reference);
      return response.data;
    } catch (error) {
      throw new Error(`Error verifying transaction: ${error.message}`);
    }
  }
}
