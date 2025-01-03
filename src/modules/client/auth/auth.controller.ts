import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản' })
  login(@Body() body: LoginDto) {
    // const { username, password, deviceToken } = body;
    // return this.authService.signIn(username, password, deviceToken);
  }
}
