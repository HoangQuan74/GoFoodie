import { Controller, Post, Body, Get, UseGuards, Patch, NotFoundException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { EDriverApprovalStatus, EDriverContractStatus } from 'src/common/enums/driver.enum';
import { RefreshTokenDto } from './refresh-token.dto';
import { Request } from 'express';
import { UniformsService } from '../uniforms/uniforms.service';
import { AdminNotificationEntity } from 'src/database/entities/admin-notification.entity';
import { ENotificationType, EUserType } from 'src/common/enums';
import { APPROVE_PATH } from 'src/common/constants/common.constant';
import { NotificationsService } from 'src/modules/admin/notifications/notifications.service';
import { DriversService } from '../drivers/drivers.service';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly driversService: DriversService,
    private readonly uniformsService: UniformsService,
    private readonly notificationsService: NotificationsService,
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
  async loginSms(@Body() body: LoginSmsDto) {
    const { idToken, deviceToken } = body;
    const profile = await this.authService.signInWithSms(idToken, deviceToken);

    const uniform = await this.uniformsService.findOneDriverUniform({
      where: { driverId: profile.id },
      order: { id: 'ASC' },
    });
    const uniformStatus = uniform ? uniform.status : 'none';
    const contractStatus = profile.signature ? EDriverContractStatus.Signed : EDriverContractStatus.Unsigned;

    return { ...profile, contractStatus, uniformStatus };
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto, @Req() req: Request) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken, req);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    const profile = await this.driversService.findOne({
      select: { activeArea: { id: true, name: true } },
      where: { id },
      relations: {
        signature: true,
        serviceTypes: true,
        activeArea: true,
      },
    });
    if (!profile) throw new NotFoundException();

    const uniform = await this.uniformsService.findOneDriverUniform({ where: { driverId: id }, order: { id: 'ASC' } });
    const uniformStatus = uniform ? uniform.status : 'none';

    const contractStatus = profile.signature ? EDriverContractStatus.Signed : EDriverContractStatus.Unsigned;
    return { profile, contractStatus, uniformStatus };
  }

  @Get('vehicle')
  @ApiOperation({ summary: 'Thông tin xe' })
  async getVehicle(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    const driver = await this.driversService.findOne({
      select: { id: true },
      where: { id },
      relations: { vehicle: { vehicleImages: true } },
    });
    if (!driver) throw new NotFoundException();

    return driver.vehicle;
  }

  @Get('banks')
  @ApiOperation({ summary: 'Thông tin tài khoản ngân hàng' })
  async getBanks(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    const driver = await this.driversService.findOne({
      select: { id: true },
      where: { id },
      relations: { banks: { bank: true, bankBranch: true } },
    });
    if (!driver) throw new NotFoundException();

    return driver.banks;
  }

  @Get('emergency-contacts')
  @ApiOperation({ summary: 'Danh sách liên hệ khẩn cấp' })
  async getEmergencyContacts(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    const driver = await this.driversService.findOne({
      select: { id: true },
      where: { id },
      relations: { emergencyContacts: { relationship: true } },
    });
    if (!driver) throw new NotFoundException();

    return driver.emergencyContacts;
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

      if (!isDraft) {
        driver.submittedAt = new Date();

        const newNotification = new AdminNotificationEntity();
        newNotification.imageId = driver.avatar;
        newNotification.from = driver.fullName;
        newNotification.userType = EUserType.Driver;
        newNotification.path = APPROVE_PATH.driverDetail(driver.id);
        newNotification.type = ENotificationType.DriverCreate;
        newNotification.relatedId = driver.id;
        newNotification.provinceId = driver.activeAreaId;
        await this.notificationsService.save(newNotification);
      }
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
