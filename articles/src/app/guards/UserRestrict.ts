import { Roles } from '../enums/Roles';
import { ForbiddenException } from '@nestjs/common';

export class UserRestrict {
  public static canAccess(role: string): boolean {
    if (role !== Roles.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
