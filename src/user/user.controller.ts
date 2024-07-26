import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDTO, Verify2FADTO } from './user.dto';
import { User } from './user.schema';
import ErrorHandler from '../utils/ErrorHandler';

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
    summary: 'User profile details',
  })
  @ApiResponse({
    status: 200,
    description: 'Get user details',
  })
  @ApiBadRequestResponse({
    description: 'Failed to retrieve user details',
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
  @ApiOperation({ summary: 'Verify 2FA for user' })
  @ApiResponse({ status: 200, description: 'Verify 2FA for user' })
  @ApiBadRequestResponse({ description: 'Failed to verify 2FA' })
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

  @Get('logout')
  @ApiOperation({
    summary: 'Logout a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout a user',
  })
  @ApiBadRequestResponse({
    description: 'Login failed due to bad request',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async signout(@Req() req, @Res() response) {
    req.headers.authorization = null;

    return response.status(201).json({
      success: true,
      message: `Logout successfully!`,
    });
  }

  @Get('generate-user-password')
  @ApiOperation({
    summary: 'Generate random password for user',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate random password for user',
  })
  @ApiBadRequestResponse({
    description: 'Failed to generate random password',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async generateUserPassword(@Res() res, @Req() req) {
    const id = req.user.id;

    const user = await this.userService.findOneById(id);

    if (user?.role !== 'superadmin') {
      return res
        .status(404)
        .json({ message: 'Login as an admin to perform this task' });
    }

    const password = await this.userService.generatePasswordService();

    // Send the QR code to the client
    res.status(200).json({ password });
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'Create a user account',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Registration failed due to bad request',
  })
  @ApiConflictResponse({
    description: 'Registration failed due to some fields already in use',
  })
  async createUser(
    @Body() data: CreateUserDTO,
    @Res() response,
    @Next() next,
    @Req() req,
  ) {
    try {
      const id = req.user.id;

      const user = await this.userService.findOneById(id);

      if (user?.role !== 'superadmin') {
        return response
          .status(404)
          .json({ message: 'Login as an admin to perform this task' });
      }
      const result = await this.userService.createUserService(data);

      return response.status(201).json({
        success: true,
        message: `User created successful!`,
        result,
      });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: error.message,
        });
      } else {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }

  @Post('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Failed to update user profile' })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async updateUserProfile(@Req() req, @Res() res, @Body() updateUserDto) {
    const id = req.user.id;

    try {
      console.log('User ID from request:', id);
      console.log('Update User DTO:', updateUserDto);

      const updatedUser = await this.userService.updateUserProfile(
        id,
        updateUserDto,
      );
      console.log('Updated User:', updatedUser);

      res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  @Post('enable-email-2fa')
  @ApiOperation({ summary: 'Enable 2FA' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  @ApiBadRequestResponse({ description: 'Failed to enable 2FA' })
  async enableTwoFA(@Req() req: any, @Res() res: any, @Next() next) {
    const userId = req.user.id;
    try {
      console.log('our user id is', userId);
      await this.userService.enableTwoFA(userId);

      return res
        .status(HttpStatus.OK)
        .json({ message: '2FA enabled successfully' });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }

  @Post('disable-2fa')
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  @ApiBadRequestResponse({ description: 'Failed to disable 2FA' })
  async disableTwoFA(@Req() req: any, @Res() res: any, @Next() next) {
    const userId = req.user.id;
    try {
      await this.userService.disableTwoFA(userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: '2FA disabled successfully' });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }

  @Get('two-factor-status')
  async getTwoFactorStatus(@Req() req) {
    const userId = req.user.id;
    const user = await this.userService.findOneById(userId);
    return { isTwoFactorEnabled: user.isTwoFactorEnabled };
  }
}
