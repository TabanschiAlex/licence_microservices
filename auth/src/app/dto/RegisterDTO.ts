import { PipeTransform } from '@nestjs/common';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';

export class RegisterDTO implements PipeTransform {
  transform(auth: AuthRegisterRequest): AuthRegisterRequest {
    return {
      name: auth.name,
      email: auth.email,
      password: auth.password,
      passwordConfirmation: auth.passwordConfirmation,
    };
  }
}
