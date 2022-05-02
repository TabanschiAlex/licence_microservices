import { PipeTransform } from '@nestjs/common';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { Roles } from '../enums/Roles';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class CreateUserDTO implements PipeTransform {
  transform(request: RequestWithUser): CreateUserRequest {
    return {
      name: request.body.name ?? null,
      role: request.body.role ?? Roles.USER,
      email: request.body.email,
      password: request.body.password,
    };
  }
}
