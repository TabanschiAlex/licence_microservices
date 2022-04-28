import { Controller, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './AuthService';
import { AuthLoginRequest } from './requests/auth/AuthLoginRequest';
import { LoginDTO } from './dto/LoginDTO';
import { RegisterDTO } from './dto/RegisterDTO';
import { AuthRegisterRequest } from './requests/auth/AuthRegisterRequest';
import { AuthResource } from './resources/auth/AuthResource';
import { UserService } from './UserService';
import { UserResource } from './resources/user/UserResource';
import { UserDTO } from './dto/UserDTO';
import { CreateUserRequest } from './requests/user/CreateUserRequest';
import { UpdateUserRequest } from './requests/user/UpdateUserRequest';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/JwtAuthGuard';

@UsePipes(ValidationPipe)
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
  }

  @MessagePattern('login')
  public async login(@Payload(LoginDTO) request: AuthLoginRequest): Promise<AuthResource> {
    return await this.authService.login(request);
  }

  @MessagePattern('register')
  public async register(@Payload(RegisterDTO) request: AuthRegisterRequest): Promise<AuthResource> {
    return await this.authService.register(request);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('get_users')
  public async index(@Payload() query) {
    return UserResource.factory(await this.userService.getAll(query));
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('get_user')
  public async edit(@Payload('uuid') uuid: string) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('create_user')
  public async store(@Payload(UserDTO) userDto: CreateUserRequest) {
    return UserResource.one(await this.userService.create(userDto));
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('update_user')
  public async update(@Payload('uuid') uuid: string, @Payload() userDto: UpdateUserRequest): Promise<string> {
    await this.userService.update(uuid, userDto);

    return 'User updated successfully';
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('delete_user')
  public async destroy(@Payload('uuid') uuid: string): Promise<string> {
    await this.userService.delete(uuid);

    return 'User deleted successfully';
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('read_user')
  public async read(@Payload('uuid') uuid: string, @Res() res: Response) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }
}
