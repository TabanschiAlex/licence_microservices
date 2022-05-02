import { Controller, Delete, Get, Inject, OnModuleInit, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { ClientKafka } from '@nestjs/microservices';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { RequestDTO } from '../dto/RequestDTO';
import { DataTypes } from '../enums/DataTypes';
import { timeout } from 'rxjs';

@Controller('articles')
export class ArticleController implements OnModuleInit {
  constructor(@Inject('ARTICLE_SERVICE') private readonly articleService: ClientKafka) {}

  async onModuleInit() {
    this.articleService.subscribeToResponseOf('get_articles');
    this.articleService.subscribeToResponseOf('get_article');
    this.articleService.subscribeToResponseOf('store_article');
    this.articleService.subscribeToResponseOf('update_article');
    this.articleService.subscribeToResponseOf('destroy_article');
    await this.articleService.connect();
  }

  @Get()
  public async index(@Req() request: RequestWithUser) {
    return this.articleService
      .send('get_articles', new RequestDTO(DataTypes.QUERY).transform(request))
      .pipe(timeout(5000));
  }

  @Get(':id')
  public async edit(@Req() request: RequestWithUser) {
    return this.articleService
      .send('get_article', new RequestDTO(DataTypes.PARAMS).transform(request))
      .pipe(timeout(5000));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async store(@Req() request: RequestWithUser) {
    return this.articleService
      .send('store_article', new RequestDTO(DataTypes.BODY).transform(request))
      .pipe(timeout(5000));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async update(@Req() request: RequestWithUser) {
    return this.articleService
      .send('update_article', new RequestDTO(DataTypes.BODY).transform(request))
      .pipe(timeout(5000));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async destroy(@Req() request: RequestWithUser) {
    return this.articleService
      .send('destroy_article', new RequestDTO(DataTypes.PARAMS).transform(request))
      .pipe(timeout(5000));
  }
}
