import { Injectable } from '@nestjs/common';
import StellarSdk from 'stellar-sdk';

@Injectable()
export class StellarService {
  async sendPayment(): Promise<any> {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    const sourceKeys = StellarSdk.Keypair.fromSecret(
      process.env.STELLAR_SECRET_KEY,
    );
    const destinationId =
      'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

    let transaction;

    try {
      await server.loadAccount(destinationId);
    } catch (error) {
      if (error instanceof StellarSdk.NotFoundError) {
        throw new Error('The destination account does not exist!');
      } else {
        throw error;
      }
    }

    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          asset: StellarSdk.Asset.native(),
          amount: '10',
        }),
      )
      .addMemo(StellarSdk.Memo.text('Test Transaction'))
      .setTimeout(180)
      .build();

    transaction.sign(sourceKeys);

    try {
      const result = await server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Something went wrong!', error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
      throw error;
    }
  }
}
