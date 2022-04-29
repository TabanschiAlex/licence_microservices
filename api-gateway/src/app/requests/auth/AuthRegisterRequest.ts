import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRegisterRequest {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly passwordConfirmation: string;
}
