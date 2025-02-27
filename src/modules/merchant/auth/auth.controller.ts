import { BadRequestException, ConflictException, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { StoresService } from 'src/modules/admin/stores/stores.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordByEmailDto, ResetPasswordBySmsDto } from './dto/reset-password.dto';
import { RegisterEmailCompletedDto, RegisterSmsDto } from './dto/register.dto';
import { JwtPayload } from 'src/common/interfaces';
import { CheckOtpDto } from './dto/check-otp.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { MerchantsService } from '../merchants/merchants.service';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { EXCEPTIONS } from 'src/common/constants';
import { Not } from 'typeorm';

@Controller('auth')
@ApiTags('Merchant Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly storesService: StoresService,
    private readonly merchantsService: MerchantsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản' })
  login(@Body() body: LoginDto) {
    const { username, password, deviceToken } = body;
    return this.authService.signIn(username, password, deviceToken);
  }

  @Post('check-otp')
  @Public()
  checkOtp(@Body() body: CheckOtpDto) {
    const { email, otp } = body;
    return this.authService.checkOtp(email, otp);
  }

  @Post('login/sms')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng mã OTP' })
  loginSms(@Body() body: LoginSmsDto) {
    const { idToken, deviceToken } = body;
    return this.authService.signInWithSms(idToken, deviceToken);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto, @Req() req: Request) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken, req);
  }

  @Post('register/email')
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản bằng email' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  registerEmail(@Body() { email }: { email: string }) {
    return this.authService.registerEmail(email);
  }

  @Post('register/sms')
  @Public()
  @ApiOperation({ summary: 'Đăng ký tài khoản bằng số điện thoại' })
  registerSms(@Body() body: RegisterSmsDto) {
    return this.authService.registerSms(body);
  }

  @Post('register/email/completed')
  @Public()
  @ApiOperation({ summary: 'Hoàn tất đăng ký tài khoản bằng email' })
  registerEmailCompleted(@Body() body: RegisterEmailCompletedDto) {
    const { otp, email, password } = body;
    return this.authService.registerEmailCompleted(otp, email, password);
  }

  @Get('profile')
  async me(@Req() req: Request) {
    const merchant = req['user'];

    const select = {
      id: true,
      name: true,
      status: true,
      approvalStatus: true,
      storeAvatarId: true,
      address: true,
      province: { id: true, name: true },
      district: { id: true, name: true },
      ward: { id: true, name: true },
    };
    const relations = ['province', 'district', 'ward'];

    if (merchant.storeId) {
      const store = await this.storesService.findOne({ where: { id: merchant.storeId }, select, relations });
      merchant.stores = [store];
    } else {
      merchant.stores = await this.storesService.find({ where: { merchantId: merchant.id }, select, relations });
    }

    return merchant;
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password-by-email')
  @Public()
  resetPassword(@Body() body: ResetPasswordByEmailDto) {
    const { otp, email, password } = body;
    return this.authService.resetPassword(otp, email, password);
  }

  @Post('reset-password-by-sms')
  @Public()
  resetPasswordBySms(@Body() body: ResetPasswordBySmsDto) {
    const { idToken, password } = body;
    return this.authService.resetPasswordBySms(idToken, password);
  }

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

  @Post('login-store')
  @ApiOperation({ summary: 'Đăng nhập vào cửa hàng, thay đổi cửa hàng hiện tại' })
  @ApiBody({ schema: { type: 'object', properties: { storeId: { type: 'number' } } } })
  loginStore(@Body() { storeId }: { storeId: number }, @CurrentUser() user: JwtPayload) {
    return this.authService.loginStore(user.id, user.deviceToken, storeId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateProfile(@Body() body: UpdateProfileDto, @CurrentUser() user: JwtPayload) {
    return this.merchantsService.save({ id: user.id, ...body });
  }

  @Patch('update-email')
  @ApiOperation({ summary: 'Cập nhật email' })
  async updateEmail(@Body() body: UpdateEmailDto, @CurrentUser() user: JwtPayload) {
    try {
      const { idToken, email } = body;
      const { id: userId } = user;
      const { phone_number } = await this.firebaseService.verifyIdToken(idToken);
      const phone = phone_number.replace('+84', '0');

      const merchant = await this.merchantsService.findOne({ where: { id: userId, phone } });
      if (!merchant) throw new BadRequestException(EXCEPTIONS.INVALID_PHONE);

      const exist = await this.merchantsService.findOne({ where: { email, id: Not(userId) } });
      if (exist) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);

      merchant.email = email;
      return this.merchantsService.save(merchant);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Patch('update-phone')
  @ApiOperation({ summary: 'Cập nhật số điện thoại' })
  async updatePhone(@CurrentUser() user: JwtPayload) {
    return this.authService.sendOtpUpdatePhone(user.id);
  }

  @Patch('update-phone/completed')
  @ApiOperation({ summary: 'Hoàn tất cập nhật số điện thoại' })
  async updatePhoneCompleted(@Body() body: UpdatePhoneDto, @CurrentUser() user: JwtPayload) {
    return this.authService.updatePhone(user.id, body);
  }
}
