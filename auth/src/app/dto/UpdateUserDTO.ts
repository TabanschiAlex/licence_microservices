import { PipeTransform } from '@nestjs/common';
import { Roles } from '../enums/Roles';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class UpdateUserDTO implements PipeTransform {
  transform(request: RequestWithUser): UpdateUserRequest {
    return {
      uuid: request.body.uuid,
      name: request.body.name ?? null,
      role: request.body.role ?? Roles.USER,
      email: request.body.email,
    };
  }
}
