export class AuthRegisterRequest {
  constructor(
    readonly name: string = null,
    readonly email: string,
    readonly password: string,
    readonly passwordConfirmation: string,
  ) {}
}
