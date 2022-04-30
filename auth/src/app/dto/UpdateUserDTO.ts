import { PipeTransform } from '@nestjs/common';
import { Roles } from '../enums/Roles';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';

export class UpdateUserDTO implements PipeTransform {
  transform(user: UpdateUserRequest): UpdateUserRequest {
    return {
      uuid: user.uuid,
      name: user.name ?? null,
      role: user.role ?? Roles.USER,
      email: user.email,
    };
  }
}
