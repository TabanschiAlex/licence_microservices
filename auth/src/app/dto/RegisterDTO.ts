import { PipeTransform } from '@nestjs/common';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class RegisterDTO implements PipeTransform {
  transform(auth: RequestWithUser): AuthRegisterRequest {
    return {
      name: auth.body.name,
      email: auth.body.email,
      password: auth.body.password,
      passwordConfirmation: auth.body.passwordConfirmation,
    };
  }
}
