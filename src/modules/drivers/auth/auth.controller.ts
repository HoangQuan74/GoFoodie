import { Controller, Post, Body, Get, UseGuards, Patch, NotFoundException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { DriversService } from '../drivers.service';
import { EDriverApprovalStatus } from 'src/common/enums/driver.enum';
import { RefreshTokenDto } from './refresh-token.dto';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
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

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto, @Req() req: Request) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken, req);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  getProfile(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    return this.driversService.findOne({
      where: { id },
      relations: {
        vehicle: true,
        signature: true,
        banks: {
          bank: true,
          bankBranch: true,
        },
        emergencyContacts: { relationship: true },
      },
    });
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() body: UpdateDriverProfileDto) {
    const { id } = user;
    const { isDraft } = body;

    const driver = await this.driversService.findOne({ where: { id }, relations: { vehicle: true } });
    if (!driver) throw new NotFoundException();

    this.driversService.merge(driver, body);

    if (typeof isDraft === 'boolean' && driver.approvalStatus !== EDriverApprovalStatus.Approved) {
      driver.approvalStatus = isDraft ? EDriverApprovalStatus.Draft : EDriverApprovalStatus.Pending;
      !isDraft && (driver.submittedAt = new Date());
    }

    return this.driversService.save(driver);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  logout(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    return this.authService.logout(id);
  }
}
