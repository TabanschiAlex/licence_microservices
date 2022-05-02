import { Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RequestDTO } from '../dto/RequestDTO';
import { DataTypes } from '../enums/DataTypes';
import { RequestWithUser } from '../interfaces/RequestWithUser';

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
  public async login(@Req() request: RequestWithUser) {
    return this.authService.send('login', new RequestDTO(DataTypes.BODY).transform(request)).pipe(timeout(5000));
  }

  @Post('auth/register')
  public async register(@Req() request: RequestWithUser) {
    return this.authService.send('register', new RequestDTO(DataTypes.BODY).transform(request)).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  public async index(@Req() request: RequestWithUser) {
    return this.authService.send('get_users', new RequestDTO(DataTypes.QUERY).transform(request)).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:uuid')
  public async edit(@Req() request: RequestWithUser) {
    return this.authService.send('get_user', new RequestDTO(DataTypes.PARAMS).transform(request)).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Post('users')
  public store(@Req() request: RequestWithUser) {
    return this.authService.send('store_user', new RequestDTO(DataTypes.BODY).transform(request)).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Put('users')
  public async update(@Req() request: RequestWithUser) {
    return this.authService.send('update_user', new RequestDTO(DataTypes.BODY).transform(request)).pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:uuid')
  public async destroy(@Param('uuid') uuid: string, @Req() request: RequestWithUser) {
    return this.authService
      .send('destroy_user', new RequestDTO(DataTypes.PARAMS).transform(request))
      .pipe(timeout(5000));
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:uuid/read')
  public async read(@Param('uuid') uuid: string, @Req() request: RequestWithUser) {
    return this.authService.send('read_user', new RequestDTO(DataTypes.PARAMS).transform(request)).pipe(timeout(5000));
  }
}
