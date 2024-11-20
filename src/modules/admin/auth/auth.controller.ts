import { Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators';

@Controller('auth')
@ApiTags('Admin Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() body: LoginDto) {
    const { username, password } = body;
    return this.authService.signIn(username, password);
  }

  @Get('profile')
  async me(@Req() req: Request) {
    return req['user'];
  }
}
