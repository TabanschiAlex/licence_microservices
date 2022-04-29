import { Controller, Res, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';

@UsePipes(ValidationPipe)
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern('login')
  public async login(@Payload('value') request) {
    console.log(request);
    // console.log(await this.authService.login(request));
    return 1;
  }

  @MessagePattern('register')
  public async register(@Payload(RegisterDTO) request: AuthRegisterRequest): Promise<AuthResource> {
    return await this.authService.register(request);
  }

  @MessagePattern('get_users')
  public async index(@Payload() query) {
    return UserResource.factory(await this.userService.getAll(query));
  }

  @MessagePattern('get_user')
  public async edit(@Payload('uuid') uuid: string) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @MessagePattern('create_user')
  public async store(@Payload(UserDTO) userDto: CreateUserRequest) {
    return UserResource.one(await this.userService.create(userDto));
  }

  @MessagePattern('update_user')
  public async update(@Payload('uuid') uuid: string, @Payload() userDto: UpdateUserRequest): Promise<string> {
    await this.userService.update(uuid, userDto);

    return 'User updated successfully';
  }

  @MessagePattern('delete_user')
  public async destroy(@Payload('uuid') uuid: string): Promise<string> {
    await this.userService.delete(uuid);

    return 'User deleted successfully';
  }

  @MessagePattern('read_user')
  public async read(@Payload('uuid') uuid: string, @Res() res: Response) {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @MessagePattern('verify_token')
  public async verifyToken(@Payload('token') token: string) {
    return this.jwtService.verify(token);
  }
}
