import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';

@Controller()
export class AuthController implements OnModuleInit {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientKafka) {}

  async onModuleInit() {
    this.authService.subscribeToResponseOf('login');
    this.authService.subscribeToResponseOf('register');
    this.authService.subscribeToResponseOf('get_users');
    this.authService.subscribeToResponseOf('get_user');
    this.authService.subscribeToResponseOf('store_user');
    this.authService.subscribeToResponseOf('update_user');
    this.authService.subscribeToResponseOf('update_user');
    this.authService.subscribeToResponseOf('update_user');
    this.authService.subscribeToResponseOf('destroy_user');
    this.authService.subscribeToResponseOf('read_user');
    this.authService.subscribeToResponseOf('verify_token');
    await this.authService.connect();
  }

  @Post('auth/login')
  public async login(@Body() request: AuthLoginRequest) {
    return this.authService.send('login', request).pipe(timeout(5000));
  }

  @Post('auth/register')
  public async register(@Body() request: AuthRegisterRequest) {
    return this.authService.send('register', request).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  public async index(@Query() query: BasicQueryRequest) {
    return this.authService.send('get_users', query).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:uuid')
  public async edit(@Param('uuid') uuid: string) {
    return this.authService.send('get_user', uuid).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Post('users')
  public store(@Body() request: CreateUserRequest) {
    return this.authService.send('store_user', request).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:uuid')
  public async update(@Body() request: UpdateUserRequest) {
    return this.authService.send('update_user', request).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:uuid')
  public async destroy(@Param('uuid') uuid: string) {
    return this.authService.send('destroy_user', uuid).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:uuid/read')
  public async read(@Param('uuid') uuid: string) {
    return this.authService.send('read_user', uuid).pipe(timeout(5000));
  }
}
