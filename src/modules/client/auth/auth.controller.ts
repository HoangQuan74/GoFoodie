import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { LoginSmsDto } from './dto/login.dto';
import { JwtPayload } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
