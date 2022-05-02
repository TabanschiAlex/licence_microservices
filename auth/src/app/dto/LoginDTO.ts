import { PipeTransform } from '@nestjs/common';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class LoginDTO implements PipeTransform {
  transform(request: RequestWithUser): AuthLoginRequest {
    return {
      email: request.body.email,
      password: request.body.password,
    };
  }
}
