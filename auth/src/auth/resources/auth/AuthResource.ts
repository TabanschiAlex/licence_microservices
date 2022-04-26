import { User } from '../../entities/User';

export class AuthResource {
  private readonly user: Record<string, any>;
  private readonly token: string;

  constructor(user: User, token: string) {
    this.user = this.handle(user);
    this.token = token;
  }

  handle(data: User): Record<string, any> {
    return {
      uuid: data.uuid,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
