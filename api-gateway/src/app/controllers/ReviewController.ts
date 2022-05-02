import { Controller, Delete, Get, Inject, OnModuleInit, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { RequestDTO } from '../dto/RequestDTO';
import { DataTypes } from '../enums/DataTypes';
import { timeout } from 'rxjs';

@Controller('reviews')
export class ReviewController implements OnModuleInit {
  constructor(@Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka) {}

  async onModuleInit() {
    this.reviewService.subscribeToResponseOf('get_reviews');
    this.reviewService.subscribeToResponseOf('get_review');
    this.reviewService.subscribeToResponseOf('store_review');
    this.reviewService.subscribeToResponseOf('update_review');
    this.reviewService.subscribeToResponseOf('destroy_review');
    await this.reviewService.connect();
  }

  @Get()
  public async index(@Req() request: RequestWithUser) {
    return this.reviewService
      .send('get_reviews', new RequestDTO(DataTypes.QUERY).transform(request))
      .pipe(timeout(5000));
  }

  @Get(':id')
  public async edit(@Req() request: RequestWithUser) {
    return this.reviewService
      .send('get_review', new RequestDTO(DataTypes.PARAMS).transform(request))
      .pipe(timeout(5000));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async store(@Req() request: RequestWithUser) {
    return this.reviewService
      .send('store_review', new RequestDTO(DataTypes.BODY).transform(request))
      .pipe(timeout(5000));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async update(@Req() request: RequestWithUser) {
    return this.reviewService
      .send('update_review', new RequestDTO(DataTypes.BODY).transform(request))
      .pipe(timeout(5000));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async destroy(@Req() request: RequestWithUser) {
    return this.reviewService
      .send('destroy_review', new RequestDTO(DataTypes.PARAMS).transform(request))
      .pipe(timeout(5000));
  }
}
