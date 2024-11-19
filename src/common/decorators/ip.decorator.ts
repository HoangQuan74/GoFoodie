import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IpAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const xForwardedFor = (request.headers['x-forwarded-for'] || '').split(',').pop().trim();
  return xForwardedFor || request.connection.remoteAddress;
});
