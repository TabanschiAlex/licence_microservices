import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/AuthService';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';
import { UserService } from '../services/UserService';
import { UserResource } from '../resources/user/UserResource';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../dto/LoginDTO';
import { RegisterDTO } from '../dto/RegisterDTO';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';

@UsePipes(ValidationPipe)
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('ARTICLE_SERVICE') private readonly articleService: ClientKafka,
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka,
  ) {}

  @MessagePattern('login')
  public async login(@Payload('value') request: AuthLoginRequest): Promise<string> {
    return JSON.stringify(await this.authService.login(new LoginDTO().transform(request)));
  }

  @MessagePattern('register')
  public async register(@Payload('value') request: AuthRegisterRequest): Promise<string> {
    return JSON.stringify(await this.authService.register(new RegisterDTO().transform(request)));
  }

  @MessagePattern('get_users')
  public async index(@Payload('value') query: BasicQueryRequest): Promise<UserResource> {
    return UserResource.factory(await this.userService.getAll(new QueryDTO().transform(query)));
  }

  @MessagePattern('get_user')
  public async edit(@Payload('value') uuid: string): Promise<UserResource> {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @MessagePattern('store_user')
  public async store(@Payload('value') request: CreateUserRequest): Promise<UserResource> {
    return UserResource.one(await this.userService.create(new CreateUserDTO().transform(request)));
  }

  @MessagePattern('update_user')
  public async update(@Payload('value') request: UpdateUserRequest): Promise<string> {
    const dto = new UpdateUserDTO().transform(request);
    await this.userService.update(dto.uuid, dto);

    return 'User updated successfully';
  }

  @MessagePattern('destroy_user')
  public async destroy(@Payload('value') uuid: string): Promise<string> {
    await this.userService.delete(uuid);
    this.articleService.emit('user_deleted', uuid);
    this.reviewService.emit('user_deleted', uuid);

    return 'User deleted successfully';
  }

  @MessagePattern('read_user')
  public async read(@Payload('uuid') uuid: string): Promise<UserResource> {
    return UserResource.one(await this.userService.getUserByUuid(uuid));
  }

  @MessagePattern('verify_token')
  public async verifyToken(@Payload('token') token: string): Promise<any> {
    return await this.jwtService.verify(token);
  }
}
