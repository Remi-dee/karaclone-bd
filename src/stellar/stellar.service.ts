import { Injectable } from '@nestjs/common';
import StellarSdk, { Server, Keypair } from 'stellar-sdk';

@Injectable()
export class StellarService {
  private readonly server = new Server('https://horizon-testnet.stellar.org');

  async createAccountWithFriendbot(publicKey: string) {
    const friendbotUrl = 'https://friendbot.stellar.org'; // Replace with actual URL

    try {
      const response = await fetch(`${friendbotUrl}?addr=${publicKey}`);
      const data = await response.json();

      if (data.hasOwnProperty('message')) {
        throw new Error(data.message); // Handle Friendbot error
      }

      console.log('Account created successfully!');
      return;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error; // Re-throw for handling in the controller
    }
  }

  async sendXlm(sourceSecret: string, destinationId: string, amount: number) {
    const sourceKeys = Keypair.fromSecret(sourceSecret);

    try {
      // Check if destination account exists
      await this.server.loadAccount(destinationId).catch(async (error) => {
        if (error instanceof StellarSdk.NotFoundError) {
          console.log(
            'Destination account not found. Creating with Friendbot...',
          );
          await this.createAccountWithFriendbot(destinationId); // Call your Friendbot function
        } else {
          throw error;
        }
      });

      // Load source account information (after potential account creation)
      const sourceAccount = await this.server.loadAccount(
        sourceKeys.publicKey(),
      );

      // Rest of the transaction building and submission logic...
    } catch (error) {
      console.error('Something went wrong!', error);
      throw error; // Re-throw error for handling in the controller
    }
  }
}
