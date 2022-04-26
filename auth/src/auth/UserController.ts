import { Controller, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './UserService';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { UserResource } from './resources/user/UserResource';
import { UserDTO } from './dto/UserDTO';
import { CreateUserRequest } from './requests/user/CreateUserRequest';
import { UpdateUserRequest } from './requests/user/UpdateUserRequest';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern()
  public async index(@Payload() query) {
    return UserResource.factory(await this.userService.getAll(query));
  }

  @MessagePattern(':uuid')
  public async edit(@Payload('uuid') uuid: string) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @MessagePattern()
  public async store(@Payload(UserDTO) userDto: CreateUserRequest) {
    return UserResource.one(await this.userService.create(userDto));
  }

  @MessagePattern(':uuid')
  public async update(@Payload('uuid') uuid: string, @Payload() userDto: UpdateUserRequest): Promise<string> {
    await this.userService.update(uuid, userDto);

    return 'User updated successfully';
  }

  @MessagePattern(':uuid')
  public async destroy(@Payload('uuid') uuid: string): Promise<string> {
    await this.userService.delete(uuid);

    return 'User deleted successfully';
  }

  @MessagePattern(':uuid/read')
  public async read(@Payload('uuid') uuid: string, @Res() res: Response) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }
}
