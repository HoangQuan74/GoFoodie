import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from 'src/common/interfaces';
import { CheckOtpDto } from './dto/check-otp.dto';
import { AuthGuard } from './auth.guard';
import { OperationsService } from '../operations/operations.service';

@Controller('auth')
@ApiTags('Admin Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly operationService: OperationsService,
  ) {}

  @Post('login')
  @Public()
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { username, password } = body;
    return this.authService.signIn(username, password, res);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken, res);
  }

  @Get('profile')
  async me(@Req() req: Request) {
    return req['user'];
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @Public()
  resetPassword(@Body() body: ResetPasswordDto) {
    const { otp, email, password } = body;
    return this.authService.resetPassword(otp, email, password);
  }

  @Post('change-password')
  changePassword(@Body() body: ChangePasswordDto, @CurrentUser() user: JwtPayload) {
    const { currentPassword, newPassword } = body;
    return this.authService.changePassword(user.id, currentPassword, newPassword);
  }

  @Post('check-otp')
  @Public()
  checkOtp(@Body() body: CheckOtpDto) {
    const { email, otp } = body;
    return this.authService.checkOtp(email, otp);
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout successfully' };
  }

  @Get('permissions')
  async permissions(@Req() req: Request) {
    const user = req['user'];
    const isRoot = user.isRoot;

    const operations = await this.operationService.find();
    const userOperations = user?.role.operations.map((operation) => operation.id);

    return operations.map((operation) => ({
      ...operation,
      isGranted: isRoot || userOperations.includes(operation.id),
    }));
  }
}
