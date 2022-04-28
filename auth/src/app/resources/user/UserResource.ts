import { User } from '../../entities/User';

export class UserResource {
  public static one(user: User) {
    return {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static factory(users: User[]): Record<string, any> {
    return users.map((user) => this.one(user));
  }
}
