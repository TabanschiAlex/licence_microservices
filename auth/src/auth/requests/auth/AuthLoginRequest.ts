import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginRequest {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
