import { Controller, Post, Catch, Req, UseGuards } from '@nestjs/common';
import { StellarService } from './stellar.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { BuyXLMDTO } from './stellar.dto';

@ApiBearerAuth('Authorization')
@ApiTags('Stellar')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('stellar')
@Catch(Error) // Handle any errors thrown from the service
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Post('send-xlm')
  @ApiBody({ type: BuyXLMDTO })
  async sendXlm(@Req() req) {
    try {
      const { amount, destinationId, sourceSecret } = req.body;

      const result = await this.stellarService.sendXlm(
        sourceSecret,
        destinationId,
        amount,
      );
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
