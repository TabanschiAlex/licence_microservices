import { PipeTransform } from '@nestjs/common';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { Roles } from '../enums/Roles';

export class CreateUserDTO implements PipeTransform {
  transform(user: CreateUserRequest): CreateUserRequest {
    return {
      name: user.name ?? null,
      role: user.role ?? Roles.USER,
      email: user.email,
      password: user.password,
    };
  }
}
