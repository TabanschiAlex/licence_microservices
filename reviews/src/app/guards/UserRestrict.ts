import { Roles } from '../enums/Roles';
import { ForbiddenException } from '@nestjs/common';

export class UserRestrict {
  public static canAccess(role: string): boolean {
    if (role !== Roles.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }

  public static applyScope(user: any, id: number): Record<string, any> {
    if (user.role === Roles.ADMIN) {
      return { id: id };
    }

    return { uuid: user.uuid, id: id };
  }
}
