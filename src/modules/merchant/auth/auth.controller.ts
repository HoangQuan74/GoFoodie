import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@ApiTags('Merchant Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() body: LoginDto) {
    const { username, password, deviceToken } = body;
    return this.authService.signIn(username, password, deviceToken);
  }

  @Post('login/sms')
  @Public()
  loginSms(@Body() body: LoginSmsDto) {
    // const { username, password } = body;
    // return this.authService.signIn(username, password);
  }

  // @Post('refresh-token')
  // @Public()
  // refreshToken(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
  //   const { refreshToken } = body;
  //   return this.authService.refreshToken(refreshToken, res);
  // }

  @Get('profile')
  async me(@Req() req: Request) {
    return req['user'];
  }

  // @Post('forgot-password')
  // @Public()
  // forgotPassword(@Body() body: ForgotPasswordDto) {
  //   const { email } = body;
  //   return this.authService.forgotPassword(email);
  // }

  // @Post('reset-password')
  // @Public()
  // resetPassword(@Body() body: ResetPasswordDto) {
  //   const { otp, email, password } = body;
  //   return this.authService.resetPassword(otp, email, password);
  // }

  @Post('change-password')
  changePassword(@Body() body: ChangePasswordDto, @CurrentUser() user: JwtPayload) {
    const { currentPassword, newPassword } = body;
    return this.authService.changePassword(user.id, currentPassword, newPassword);
  }

  // @Post('logout')
  // @Public()
  // logout(@Res({ passthrough: true }) res: Response) {
  //   res.clearCookie('token');
  //   return { message: 'Logout successfully' };
  // }
}
