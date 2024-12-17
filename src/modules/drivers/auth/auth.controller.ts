import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators';
import { LoginDto, LoginSmsDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
