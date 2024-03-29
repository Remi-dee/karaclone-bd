import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { Verify2FADTO } from './user.dto';

@ApiBearerAuth('Authorization')
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'UnauthorisedException: Unauthorised to access resource',
})
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
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
  async getLoggedInUser(@Res() res, @Req() req) {
    const id = req.user.id;

    const user = await this.userService.findOneById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the QR code to the client
    res.status(200).json({ user });
  }

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
      user._id,
    );

    // Send the QR code to the client
    res.status(200).json({ qrCode });
  }

  @Post('verify-2fa')
  @ApiOperation({ summary: 'Enable 2FA for user' })
  @ApiResponse({ status: 200, description: 'Enable 2FA for user' })
  @ApiBadRequestResponse({ description: 'Failed to enable 2FA' })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async verifyTwoFactorAuth(
    @Res() res,
    @Req() req,
    @Body() data: Verify2FADTO,
  ) {
    const id = req.user.id;

    const user = await this.userService.findOneById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate QR code for the user's secret key
    const verifyCode = await this.userService.verifyTOTP(user.secret, data);

    // Send the QR code to the client
    res.status(200).json({ verifyCode });
  }
}
