import {
  Controller,
  Body,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Res,
  Query,
  HttpException,
  HttpStatus,
  Logger,
  Put,
} from '@nestjs/common';
import { CurrencyPairService } from './currency-pair.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import {
  AddCurrencyPairDTO,
  CurrencyPairListResponse,
  CurrencyPairResponse,
  UpdateCurrencyPairDTO,
} from './currency-pair.dto';
import { CurrencyPair } from './currency-pair.schema';
import { PaginationParams } from '../app.util';
import ErrorHandler from '../utils/ErrorHandler';
import { ParseObjectIdPipe } from '../app.pipe';
import { ObjectId } from 'mongodb';
import { UserService } from '../user/user.service';

@ApiBearerAuth('Authorization')
@ApiTags('Currency Pair')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('currencypair')
export class CurrencyPairController {
  constructor(
    private readonly currencyPairService: CurrencyPairService,
    private readonly userService: UserService,
  ) {}

  @Post('add')
  @ApiOperation({
    summary: 'Create a currency pair',
  })
  @ApiResponse({
    status: 200,
    description: 'Create a currency pair',
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to create a currency pair',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async createCurrencyPair(
    @Res() res,
    @Req() req,
    @Body() data: AddCurrencyPairDTO,
  ) {
    try {
      const id = req.user.id;

      const addedCurrencyPair =
        await this.currencyPairService.createCurrencyPairService(id, data);

      res.status(201).json({
        message: 'Currency pair added successfully',
        addedCurrencyPair,
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

  @Get('/get-all')
  @ApiOperation({
    summary: 'Get all currency pairs',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all currency pairs',
    type: CurrencyPairListResponse,
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to get all currency pairs',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async getAllPairs(
    @Req() req,
    @Res() res,
    @Query() { skip, limit }: PaginationParams,
  ): Promise<CurrencyPairListResponse> {
    try {
      // const id = req.user.id;

      // const user = await this.userService.findOneById(id);

      // if (user.role !== 'superadmin') {
      //   return res
      //     .status(404)
      //     .json({ message: 'You are not authorized to perform this action!' });
      // }
      const results = await this.currencyPairService.getAllCurrencyPairService(
        skip,
        limit,
      );
      return res.status(200).json({
        message: 'All currency pairs retrieved successfully!',
        results,
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

  @Get(':id')
  @ApiOperation({
    summary: 'Get currency pair',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the currency pair',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Get currency pair',
    type: CurrencyPairResponse,
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to get currency pair',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async getACurrencyPair(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: ObjectId,
  ): Promise<CurrencyPair> {
    try {
      const userid = req.user.id;

      const user = await this.userService.findOneById(userid);

      if (user.role !== 'superadmin') {
        return res
          .status(404)
          .json({ message: 'You are not authorized to perform this action!' });
      }
      const currencyPair =
        await this.currencyPairService.getCurrencyPairService(id);
      return res.status(200).json({
        message: 'Currency pair retrieved successfully',
        currencyPair,
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

  @Put('/update/:id')
  @ApiOperation({
    summary: 'Get currency pair',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the currency pair',
    type: 'string',
    required: true,
  })
  @ApiBody({ type: UpdateCurrencyPairDTO })
  @ApiResponse({
    status: 200,
    description: 'Get currency pair',
    type: CurrencyPairResponse,
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to get currency pair',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async updateCurrencyPair(
    @Res() res,
    @Req() req,
    @Param('id', ParseObjectIdPipe) id: ObjectId,
  ): Promise<CurrencyPair> {
    try {
      const result = await this.currencyPairService.updateCurrencyPairService(
        id,
        req.body,
      );

      return res.status(200).json({
        message: 'User updated successfully',
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

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Get currency pair',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the currency pair',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Get currency pair',
    type: CurrencyPairResponse,
  })
  @ApiBadRequestResponse({
    status: 404,
    description: 'Failed to get currency pair',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'UnauthorisedException: Invalid credentials',
  })
  async deleteCurrencyPair(
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: ObjectId,
  ): Promise<void> {
    try {
      await this.currencyPairService.deleteCurrencyPairService(id);
      return res.status(200).json({
        message: 'Currency pair successfully deleted',
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        // Handle the "not found" exception
        return res.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
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
