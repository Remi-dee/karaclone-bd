import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UserService } from './user.service';

@ApiBearerAuth('Authorization')
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('enable-2fa')
  @ApiOperation({
    summary: 'Enable 2FA for user',
  })
  @ApiResponse({
    status: 200,
    description: 'Enable 2FA for user',
  })
  @ApiBadRequestResponse({
    description: 'Failed to enable 2FA',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async enableTwoFactorAuth(@Res() res, @Req() req) {
    const id = req.user.id;

    const user = await this.userService.findOneById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate QR code for the user's secret key
    const qrCode = await this.userService.generateQrCode(
      `otpauth://totp/FxKara:${user.name}?secret=${user.secret}&issuer=FxKara`,
    );

    // Send the QR code to the client
    res.status(200).json({ qrCode });
  }

  @Get('verify-2fa')
  @ApiOperation({
    summary: 'Enable 2FA for user',
  })
  @ApiResponse({
    status: 200,
    description: 'Enable 2FA for user',
  })
  @ApiBadRequestResponse({
    description: 'Failed to enable 2FA',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async verifyTwoFactorAuth(@Res() res, @Req() req, @Body() topt: string) {
    const id = req.user.id;

    const user = await this.userService.findOneById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate QR code for the user's secret key
    const verifyCode = await this.userService.verifyTOTP(user.secret,topt)

    // Send the QR code to the client
    res.status(200).json({ verifyCode });
  }
}
