import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversionFeeService } from './conversion-fee.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateConversionFeeDTO,
  UpdateConversionFeeDTO,
} from './conversion-fee.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ObjectId } from 'mongoose';

@Controller('conversion-fee')
@ApiTags('Conversion fee')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
export class ConversionFeeController {
  constructor(private conversionFeeService: ConversionFeeService) {}

  @Get('get-all')
  @ApiOperation({
    summary: 'Get all conversion fees',
  })
  @ApiResponse({
    status: 200,
    description: 'List of conversion fees',
  })
  @ApiBadRequestResponse({
    description: 'Failed to get all conversion fees',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorizedException: Invalid credentials',
  })
  async getAllConversionFee() {
    return this.conversionFeeService.findAll();
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a conversion fee' })
  @ApiResponse({
    status: 201,
    description: 'Conversion fee created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to create a conversion fee',
  })
  async createConversionFee(
    @Body() conversionFeeDTO: CreateConversionFeeDTO,
    @Req() req,
  ) {
    const id = req.user.id;

    return this.conversionFeeService.createConversionFee(id, conversionFeeDTO);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a conversion fee' })
  @ApiParam({
    name: 'id',
    description: 'Id of the conversion fee',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Conversion fee updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to update the conversion fee',
  })
  async updateConversionFee(
    @Param('id') feeId: ObjectId,
    @Body() updateData: UpdateConversionFeeDTO,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    try {
      const updatedFee = await this.conversionFeeService.updateConversionFee(
        userId,
        feeId,
        updateData,
      );

      if (!updatedFee) {
        throw new NotFoundException('Conversion fee not found');
      }

      return { message: 'Successfully Updated', updatedFee };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a conversion fee' })
  @ApiParam({
    name: 'id',
    description: 'Id of the conversion fee',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Conversion fee deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Failed to delete the conversion fee',
  })
  async deleteConversionFee(@Param('id') feeId: ObjectId, @Req() req: any) {
    const userId = req.user.id;
    try {
      const deletedFee = await this.conversionFeeService.deleteConversionFee(
        feeId,
        userId,
      );

      if (!deletedFee) {
        throw new NotFoundException('Conversion fee not found');
      }

      return deletedFee;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
