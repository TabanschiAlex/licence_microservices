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
  public async index(@Payload('value') query: RequestWithUser): Promise<UserResource> {
    return UserResource.factory(await this.userService.getAll(new QueryDTO().transform(query)));
  }

  @MessagePattern('get_user')
  public async edit(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    return UserResource.one(await this.userService.getUserByUuid(request.body));
  }

  @MessagePattern('store_user')
  public async store(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    return UserResource.one(await this.userService.create(new CreateUserDTO().transform(request)));
  }

  @MessagePattern('update_user')
  public async update(@Payload('value') request: RequestWithUser): Promise<string> {
    const dto = new UpdateUserDTO().transform(request);
    await this.userService.update(dto.uuid, dto);

    return 'User updated successfully';
  }

  @MessagePattern('destroy_user')
  public async destroy(@Payload('value') request: RequestWithUser): Promise<string> {
    await this.userService.delete(request.body);
    this.articleService.emit('user_deleted', request.body);
    this.reviewService.emit('user_deleted', request.body);

    return 'User deleted successfully';
  }

  @MessagePattern('read_user')
  public async read(@Payload('value') request: RequestWithUser): Promise<UserResource> {
    return UserResource.one(await this.userService.getUserByUuid(request.body));
  }

  @MessagePattern('verify_token')
  public async verifyToken(@Payload('value') request): Promise<any> {
    return await this.jwtService.verify(request);
  }
}
