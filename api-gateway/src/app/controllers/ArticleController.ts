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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleRequest } from '../requests/article/ArticleRequest';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { ClientKafka } from '@nestjs/microservices';

@Controller('articles')
export class ArticleController {
  constructor(
    @Inject('ARTICLES_SERVICE') private readonly articleService: ClientKafka,
  ) {}

  @Get()
  public async index(@Query() query) {
    return this.articleService.send('get_articles', query);
  }

  @Get(':id')
  public async edit(@Param('id') id: string) {
    return this.articleService.send('get_article', id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async store(@Body() request: ArticleRequest, @Req() req) {
    return this.articleService.send('store_article', request);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id') id: string,
    @Body() request: ArticleRequest,
  ) {
    return this.articleService.send('update_article', request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    return this.articleService.send('destroy_article', id);
  }
}
