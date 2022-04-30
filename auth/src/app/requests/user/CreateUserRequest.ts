import { Roles } from '../../enums/Roles';

export class CreateUserRequest {
  constructor(readonly email: string, readonly password: string, readonly name?: string, readonly role?: Roles) {}
}
