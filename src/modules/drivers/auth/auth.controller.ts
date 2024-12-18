import { Controller, Post, Body, Get, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { DriversService } from '../drivers.service';
import { EDriverApprovalStatus } from 'src/common/enums/driver.enum';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly driversService: DriversService,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản' })
  login(@Body() body: LoginDto) {
    const { username, password, deviceToken } = body;
    return this.authService.signIn(username, password, deviceToken);
  }

  @Post('login/sms')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng mã OTP' })
  loginSms(@Body() body: LoginSmsDto) {
    const { idToken, deviceToken } = body;
    return this.authService.signInWithSms(idToken, deviceToken);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() body: UpdateDriverProfileDto) {
    const { id } = user;
    const driver = await this.driversService.findOne({ where: { id }, relations: { vehicle: true } });
    if (!driver) throw new NotFoundException();

    this.driversService.merge(driver, body);

    if (driver.approvalStatus !== EDriverApprovalStatus.Approved) {
      driver.approvalStatus = EDriverApprovalStatus.Pending;
    }

    return this.driversService.save(driver);
  }
}
