import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tlSigning from 'truelayer-signing';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { PaymentRequestDTO } from './truelayer.dto';

@Injectable()
export class TrueLayerService {
  private readonly BASE_URL: string;
  private readonly AUTH_URL: string;
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly SCOPE: string;
  private readonly GRANT_TYPE: string;
// NOT applicable
  private accessToken: string | null = null;
  private tokenExpiration: number | null = null;

  constructor(private readonly configService: ConfigService) {
    this.BASE_URL = this.configService.get<string>('TRUELAYER_BASE_URL');
    this.AUTH_URL = this.configService.get<string>('TRUELAYER_AUTH_URL');
    this.CLIENT_ID = this.configService.get<string>('TRUELAYER_CLIENT_ID');
    this.CLIENT_SECRET = this.configService.get<string>(
      'TRUELAYER_CLIENT_SECRET',
    );
    this.SCOPE = 'payments';
    this.GRANT_TYPE = 'client_credentials';
  }

  private async getAccessToken(): Promise<string> {
    if (
      this.accessToken &&
      this.tokenExpiration &&
      Date.now() < this.tokenExpiration
    ) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        this.AUTH_URL,
        new URLSearchParams({
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          scope: this.SCOPE,
          grant_type: this.GRANT_TYPE,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + response.data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to obtain access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async generateHeaders(
    path: string,
    method: any,
    body: any,
  ): Promise<Record<string, string>> {
    const accessToken = await this.getAccessToken();
    const idempotencyKey = randomUUID();
    console.log('WE GOT HERE', accessToken);

    const privateKeyPem = this.configService
      .get<string>('TRUELAYER_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
    console.log(
      'private key 1',
      this.configService.get<string>('TRUELAYER_PRIVATE_KEY'),
    );

    console.log('private key 2', privateKeyPem);

    try {
      const tlSignature = tlSigning.sign({
        kid: this.configService.get<string>('TRUELAYER_KID'),
        privateKeyPem: privateKeyPem,
        method,
        path: path,
        headers: {
          'Idempotency-Key': idempotencyKey,
          'X-Bar-Header': 'abcdefg',
        },
        body: JSON.stringify(body),
      });

      console.log('our signing key is', tlSignature);

      return {
        Authorization: `Bearer ${accessToken}`,
        'Idempotency-Key': idempotencyKey,
        'X-Bar-Header': 'abcdefg',
        'Tl-Signature': tlSignature,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.log('unable to sign key:', error);
    }

    // const request = {
    //   method: 'POST',
    //   url: 'https://api.truelayer-sandbox.com/test-signature',
    //   // Request body & any signed headers *must* exactly match what was used to generate the signature.
    //   data: body,
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     'Idempotency-Key': idempotencyKey,
    //     'X-Bar-Header': 'abcdefg',
    //     'Tl-Signature': tlSignature,
    //   },
    // };
    // console.log('Sending ' + JSON.stringify(request, null, 2) + '\n');

    // axios(request)
    //   // 204 means success
    //   .then((response) => console.log(`${response.status} ✓`))
    //   // 401 means either the access token is invalid, or the signature is invalid.
    //   .catch((err) =>
    //     console.warn(
    //       `${err.response.status} ${JSON.stringify(err.response.data)}`,
    //     ),
    //   );
  }

  // private async generateHeaders(
  //   path: string,
  //   method: any,
  //   body: any,
  // ): Promise<Record<string, string>> {
  //   const accessToken = await this.getAccessToken();
  //   console.log('this is token,', accessToken);
  //   const idempotencyKey = randomUUID();
  //   const tlSignature = tlSigning.sign({
  //     kid: this.configService.get<string>('TRUELAYER_KID'),
  //     privateKeyPem: this.configService.get<string>('TRUELAYER_PRIVATE_KEY'),
  //     method,
  //     path: '/v3/payments',
  //     headers: {
  //       'Idempotency-Key': idempotencyKey,
  //       'X-Bar-Header': 'abcdefg',
  //     },
  //     body: JSON.stringify(body),
  //   });
  //   console.log('this is2', tlSignature);
  //   return {
  //     Authorization: `Bearer ${accessToken}`,
  //     'Idempotency-Key': idempotencyKey,
  //     'X-Bar-Header': 'abcdefg',
  //     'Tl-Signature': tlSignature,
  //     'Content-Type': 'application/json',
  //   };
  // }

  async initiatePayment(paymentRequest: PaymentRequestDTO): Promise<any> {
    const path = '/v3/payments';
    const method = 'POST';
    console.log(`this is 2, ${this.BASE_URL}${path}`);
    const headers = await this.generateHeaders(path, method, paymentRequest);
    console.log('this is header,', headers);
    try {
      console.log(`this is 3, ${this.BASE_URL}${path}`);
      console.log('this is 4', paymentRequest);
      const response = await axios.post(
        `${this.BASE_URL}${path}`,
        paymentRequest,
        {
          headers,
          timeout: 30000,
        },
      );
      console.log('this is', response);
      return response.data;
    } catch (error) {
      console.error('this is service error', error); // Log the entire error object

      if (error.response) {
        console.error('this is service response error', error.response.data);
        throw new HttpException(
          error.response.data || 'An error occurred during payment initiation',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        console.error('this is service non-response error');
        throw new HttpException(
          'An error occurred during payment initiation',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Add other methods that use the generateHeaders method
  async someOtherEndpoint(someRequest: any): Promise<any> {
    const path = '/some/other/endpoint';
    const method = 'POST';
    const headers = await this.generateHeaders(path, method, someRequest);

    try {
      const response = await axios.post(
        `${this.BASE_URL}${path}`,
        someRequest,
        { headers },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'An error occurred during the request',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'An error occurred during the request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
