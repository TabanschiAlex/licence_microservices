import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';

export class RegisterDTO implements PipeTransform {
  transform(auth: AuthRegisterRequest, metadata: ArgumentMetadata): AuthRegisterRequest {
    return {
      email: auth.email,
      password: auth.password,
      passwordConfirmation: auth.passwordConfirmation,
    };
  }
}
