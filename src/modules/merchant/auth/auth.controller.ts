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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { StoresService } from 'src/modules/admin/stores/stores.service';
import { EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';

@Controller('auth')
@ApiTags('Merchant Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storesService: StoresService,
  ) {}

  @Post('login')
  @Public()
  login(@Body() body: LoginDto) {
    const { username, password, deviceToken } = body;
    return this.authService.signIn(username, password, deviceToken);
  }

  @Post('login/sms')
  @Public()
  loginSms(@Body() body: LoginSmsDto) {
    const { idToken, deviceToken } = body;
    return this.authService.signInWithSms(idToken, deviceToken);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto, @Req() req: Request) {
    const { refreshToken } = body;
    // const jwt = req.headers['authorization']?.split(' ')[1];
    // console.log(jwt);
    return this.authService.refreshToken(refreshToken, req);
  }

  @Get('profile')
  async me(@Req() req: Request) {
    const merchant = req['user'];

    if (merchant.storeId) {
      const store = await this.storesService.findOne({ where: { id: merchant.storeId }, select: ['id', 'name'] });
      merchant.stores = [store];
    } else {
      merchant.stores = await this.storesService.find({
        where: { merchantId: merchant.id, status: EStoreStatus.Active, approvalStatus: EStoreApprovalStatus.Approved },
        select: ['id', 'name'],
      });
    }

    return merchant;
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

  @Post('logout')
  @Public()
  async logout(@Req() req: Request) {
    await this.authService.logout(req);
    return { message: 'Logout successfully' };
  }
}
