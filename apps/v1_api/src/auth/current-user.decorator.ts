import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { V1AuthUser } from './v1-auth-user';

type V1Request = Request & { v1User?: V1AuthUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): V1AuthUser | undefined => {
    const request = context.switchToHttp().getRequest<V1Request>();
    return request.v1User;
  },
);
