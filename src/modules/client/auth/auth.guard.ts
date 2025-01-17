import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EXCEPTIONS } from 'src/common/constants';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ClientService } from '../client.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly clientService: ClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;
      const { id, deviceToken } = payload;
      const client = await this.clientService.findOne({ where: { id } });

      if (deviceToken !== client.deviceToken) throw new UnauthorizedException(EXCEPTIONS.INVALID_DEVICE_TOKEN);

      client.lastLogin = new Date();
      this.clientService.save(client);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = client;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
