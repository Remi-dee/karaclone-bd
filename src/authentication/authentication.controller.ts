import { Body, Controller, Post, HttpStatus, Next, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ForgotPasswordDTO,
  LoginUserDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
} from '../user/user.dto';
import { User } from '../user/user.schema';
import { AuthenticationService } from './authentication.service';
import ErrorHandler from '../utils/ErrorHandler';
import { IActivationRequest } from './authentication.dto';
import { UserService } from '../user/user.service';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'Register a user account',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Registration failed due to bad request',
  })
  @ApiConflictResponse({
    description: 'Registration failed due to some fields already in use',
  })
  async registerUser(
    @Body() registerUserDTO: RegisterUserDTO,
    @Res() response,
    @Next() next,
  ) {
    try {
      const data = await this.authService.register(registerUserDTO);

      return response.status(201).json({
        success: true,
        message: `Please check your email to activate your account!`,
        activation_token: data,
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

  @Post('/activate-user')
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({
    status: 201,
    description: 'Activate user account',
  })
  @ApiBadRequestResponse({
    description: 'Activation failed due to bad request',
  })
  @ApiConflictResponse({
    description: 'Activation failed due to some fields already in use',
  })
  async userActivation(
    @Body() activatedto: IActivationRequest,
    @Res() response,
    @Next() next,
  ) {
    try {
      await this.authService.activateUser(activatedto);

      return response.status(201).json({
        success: true,
        message: `Your account is activated successful, enjoy your stay here!`,
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

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Login a user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Login failed due to bad request',
  })
  @ApiUnauthorizedResponse({
    description: 'UnauthorisedException: Invalid credentials',
  })
  async signin(@Body() loginDto: LoginUserDTO, @Res() response, @Next() next) {
    try {
      const data = await this.authService.login(loginDto);

      return response.status(201).json({
        success: true,
        message: `Login successfully!`,
        data,
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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset request successful',
  })
  @ApiBadRequestResponse({
    description: 'Password reset request failed due to bad request',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDTO,
    @Res() response,
    @Next() next,
  ) {
    try {
      await this.authService.requestPasswordReset(forgotPasswordDto.email);
      return response.status(200).json({
        success: true,
        message: `Password reset instructions have been sent to your email.`,
      });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      } else {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  @ApiBadRequestResponse({
    description: 'Password reset failed due to bad request',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDTO,
    @Res() response,
    @Next() next,
  ) {
    try {
      await this.authService.resetPassword(
        resetPasswordDto.resetToken,
        resetPasswordDto.newPassword,
      );
      return response.status(200).json({
        success: true,
        message: `Password reset successfully!`,
      });
    } catch (error: any) {
      if (error instanceof ErrorHandler) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      } else {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  }
}
