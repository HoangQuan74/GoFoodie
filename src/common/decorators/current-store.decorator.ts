import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const CurrentStore = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest();
  const storeId = request.storeId;

  if (!storeId) throw new ForbiddenException();
  return storeId;
});
