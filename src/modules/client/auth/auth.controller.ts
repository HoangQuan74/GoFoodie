import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { LoginSmsDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/sms')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng mã OTP' })
  login(@Body() body: LoginSmsDto) {
    return this.authService.signInWithSms(body);
  }
}
