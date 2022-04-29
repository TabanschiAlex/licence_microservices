import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';
import { Response } from 'express';
import { timeout } from 'rxjs';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@Controller('auth')
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

  @Post('login')
  public async login(@Body() request: AuthLoginRequest) {
    return this.authService.send('login', request).pipe(timeout(5000));
  }

  @Post('register')
  public async register(@Body() request: AuthRegisterRequest) {
    return this.authService.send('register', request).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  public async index(@Query() query) {
    return this.authService.send('get_users', query).pipe(timeout(5000));
  }

  @Get('users/:uuid')
  public async edit(@Param('uuid') uuid: string) {
    return this.authService.send('get_user', uuid).pipe(timeout(5000));
  }

  @Post()
  public store(@Body() userDto: CreateUserRequest) {
    return this.authService.send('store_user', userDto).pipe(timeout(5000));
  }

  @Put('users/:uuid')
  public async update(@Param('uuid') uuid: string, @Body() userDto: UpdateUserRequest) {
    return this.authService.send('update_user', uuid).pipe(timeout(5000));
  }

  @Delete('users/:uuid')
  public async destroy(@Param('uuid') uuid: string) {
    return this.authService.send('destroy_user', uuid).pipe(timeout(5000));
  }

  @Get('users/:uuid/read')
  public async read(@Param('uuid') uuid: string, @Res() res: Response) {
    return this.authService.send('read_user', uuid).pipe(timeout(5000));
  }
}
