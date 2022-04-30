import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { ServiceCurrentlyUnavailableException } from '../exceptions/ServiceCurrentlyUnavailableException';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientKafka) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.split(' ')[0];
    const token = authHeader?.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      req.user = this.authService.send('verify_token', token).pipe(timeout(5000));
    } catch (e) {
      throw new ServiceCurrentlyUnavailableException();
    }

    return true;
  }
}
