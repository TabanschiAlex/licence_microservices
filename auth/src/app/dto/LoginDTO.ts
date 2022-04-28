import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';

export class LoginDTO implements PipeTransform {
  transform(auth: AuthLoginRequest, metadata: ArgumentMetadata): AuthLoginRequest {
    return {
      email: auth.email,
      password: auth.password,
    };
  }
}
