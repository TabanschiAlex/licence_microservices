export class CreateUserRequest {
  readonly email: string;

  readonly password: string;

  readonly name?: string = null;

  readonly role?: string = 'user';
}
