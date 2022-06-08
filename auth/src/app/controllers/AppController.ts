import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { UserResource } from '../resources/user/UserResource';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../dto/LoginDTO';
import { RegisterDTO } from '../dto/RegisterDTO';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { UserRestrict } from '../guards/UserRestrict';
import { UpdateNameDTO } from '../dto/UpdateNameDTO';

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
  public async login(@Payload('value') request: RequestWithUser): Promise<string> {
    return JSON.stringify(await this.authService.login(new LoginDTO().transform(request)));
  }

  @MessagePattern('register')
  public async register(@Payload('value') request: RequestWithUser): Promise<string> {
    return JSON.stringify(await this.authService.register(new RegisterDTO().transform(request)));
  }

  @MessagePattern('get_users')
  public async index(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    UserRestrict.canAccess(request.user.role);

    return UserResource.factory(await this.userService.getAll(new QueryDTO().transform(request)));
  }

  @MessagePattern('get_user')
  public async edit(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    const scope = UserRestrict.applyScope(request.user, request.body.uuid);

    return UserResource.one(await this.userService.getUserByUuid(scope));
  }

  @MessagePattern('store_user')
  public async store(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    UserRestrict.canAccess(request.user.role);

    return UserResource.one(await this.userService.create(new CreateUserDTO().transform(request)));
  }

  @MessagePattern('update_user')
  public async update(@Payload('value') request: RequestWithUser): Promise<string> {
    UserRestrict.canAccess(request.user.role);
    const dto = new UpdateUserDTO().transform(request);
    await this.userService.update(dto.uuid, dto);

    return 'User updated successfully';
  }

  @MessagePattern('update_user_name')
  public async updateName(@Payload('value') request: RequestWithUser): Promise<string> {
    const dto = new UpdateNameDTO().transform(request);
    const scope = UserRestrict.applyScope(request.user, dto.uuid);
    await this.userService.update(scope, dto);

    return 'User updated successfully';
  }

  @MessagePattern('destroy_user')
  public async destroy(@Payload('value') request: RequestWithUser): Promise<string> {
    UserRestrict.canAccess(request.user.role);
    await this.userService.delete(request.body.uuid);

    this.articleService.emit('user_deleted', request.body.uuid);
    this.reviewService.emit('user_deleted', request.body.uuid);

    return 'User deleted successfully';
  }

  @MessagePattern('read_user')
  public async read(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    return UserResource.one(await this.userService.getUserByUuid(request.body.uuid));
  }

  @MessagePattern('verify_token')
  public async verifyToken(@Payload('value') request): Promise<any> {
    return await this.jwtService.verify(request);
  }
}
