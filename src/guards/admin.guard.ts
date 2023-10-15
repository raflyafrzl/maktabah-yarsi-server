import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomClientException } from 'src/exception/custom.exception';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const { role } = request.user;

    if (role !== 'admin') {
      throw new CustomClientException(
        "Can't access the page",
        403,
        'forbidden',
      );
    }

    return true;
  }
}
