import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_SECRET } from 'src/common/constants';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly adminService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      })) as JwtPayload;

      const { id } = payload;
      const admin = await this.adminService.findOne({ where: { id } });
      // if (!admin.isActivated) throw new UnauthorizedException();

      admin.lastLogin = new Date();
      this.adminService.save(admin);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      delete admin.password;
      request['user'] = admin;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
