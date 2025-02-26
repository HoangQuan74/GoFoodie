import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { LoginSmsDto } from './dto/login.dto';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from './auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ClientService } from '../clients/client.service';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
  ) {}

  @Post('login/sms')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng mã OTP' })
  login(@Body() body: LoginSmsDto) {
    return this.authService.signInWithSms(body);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  profile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  updateProfile(@CurrentUser() user: JwtPayload, @Body() body: UpdateProfileDto) {
    return this.clientService.save({ ...user, ...body });
  }
}
