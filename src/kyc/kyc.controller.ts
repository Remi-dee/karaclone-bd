import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import ErrorHandler from '../utils/ErrorHandler';
import { KycService } from './kyc.service';
import { CreateKYCDTO } from './kyc.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

@ApiBearerAuth('Authorization')
@ApiTags('KYC')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('kyc')
export class KycController {
  constructor(private readonly kycservice: KycService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create kyc for user',
  })
  @ApiBody({ type: CreateKYCDTO })
  @ApiResponse({
    status: 200,
    description: 'Create kyc for user',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to create kyc for user',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async createCurrencyPair(@Res() res, @Req() req, @Body() data: CreateKYCDTO) {
    try {
      const id = req.user.id;

      const result = await this.kycservice.createKYC(data, id);

      res.status(201).json({
        message: 'KYC is saved successfully',
        result,
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        // Handle the "not found" exception
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message, // Send the error message to the client
        });
      } else {
        Logger.error(error);
        throw new HttpException(
          'Something went wrong, please try again later',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
