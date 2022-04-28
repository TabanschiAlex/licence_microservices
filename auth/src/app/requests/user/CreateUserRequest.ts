import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../../enums/Roles';

export class CreateUserRequest {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsString()
  readonly name?: string = null;

  @IsEnum(Roles)
  readonly role?: Roles = Roles.USER;
}
