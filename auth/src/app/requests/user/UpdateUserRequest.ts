import { Roles } from '../../enums/Roles';

export class UpdateUserRequest {
  constructor(readonly uuid, readonly name: string, readonly email: string, readonly role: Roles) {}
}
