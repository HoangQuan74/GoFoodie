import { Controller, Post, Body, Get, UseGuards, Patch, NotFoundException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { DriversService } from '../drivers.service';
import { EDriverApprovalStatus, EDriverContractStatus } from 'src/common/enums/driver.enum';
import { RefreshTokenDto } from './refresh-token.dto';
import { Request } from 'express';
import { UniformsService } from '../uniforms/uniforms.service';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly driversService: DriversService,
    private readonly uniformsService: UniformsService,
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
  async getProfile(@CurrentUser() user: JwtPayload) {
    const { id } = user;
    const profile = await this.driversService.findOne({
      where: { id },
      relations: {
        signature: true,
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
      relations: { vehicle: true },
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
