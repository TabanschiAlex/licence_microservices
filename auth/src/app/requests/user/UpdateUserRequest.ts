import { IsEnum, IsString } from 'class-validator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../../entities/User';
import { Roles } from '../../enums/Roles';

export class UpdateUserRequest implements QueryDeepPartialEntity<User> {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsEnum(Roles)
  readonly role: Roles;
}
