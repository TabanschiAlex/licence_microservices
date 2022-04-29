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
  Res,
} from '@nestjs/common';
import { AuthRegisterRequest } from '../requests/auth/AuthRegisterRequest';
import { AuthLoginRequest } from '../requests/auth/AuthLoginRequest';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';
import { UpdateUserRequest } from '../requests/user/UpdateUserRequest';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientKafka,
  ) {}

  @Post('login')
  public async login(@Body() request: AuthLoginRequest) {
    return this.authService.send('login', request);
  }

  @Post('register')
  public async register(@Body() request: AuthRegisterRequest) {
    return this.authService.send('register', request);
  }

  @Get()
  public async index(@Query() query) {
    return this.authService.send('get_users', query);
  }

  @Get(':uuid')
  public async edit(@Param('uuid') uuid: string) {
    return this.authService.send('get_user', uuid);
  }

  @Post()
  public store(@Body() userDto: CreateUserRequest) {
    return this.authService.send('store_user', userDto);
  }

  @Put(':uuid')
  public async update(
    @Param('uuid') uuid: string,
    @Body() userDto: UpdateUserRequest,
  ) {
    return this.authService.send('update_user', uuid);
  }

  @Delete(':uuid')
  public async destroy(@Param('uuid') uuid: string) {
    return this.authService.send('destroy_user', uuid);
  }

  @Get(':uuid/read')
  public async read(@Param('uuid') uuid: string, @Res() res: Response) {
    return this.authService.send('read_user', uuid);
  }
}
