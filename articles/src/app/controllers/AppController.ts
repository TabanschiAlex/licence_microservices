import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ArticleService } from '../services/ArticleService';
import { ArticleResource } from '../resources/ArticleResource';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { CreateArticleRequest } from '../requests/CreateArticleRequest';
import { UpdateArticleRequest } from '../requests/UpdateArticleRequest';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateArticleDTO } from '../dto/CreateArticleDTO';
import { UpdateArticleDTO } from '../dto/UpdateArticleDTO';

@Controller('articles')
@UsePipes(ValidationPipe)
export class AppController {
  constructor(
    private readonly articleService: ArticleService,
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka,
  ) {}

  @MessagePattern('get_articles')
  public async index(@Payload('value') query: BasicQueryRequest): Promise<ArticleResource> {
    return ArticleResource.factory(await this.articleService.getAll(new QueryDTO().transform(query)));
  }

  @MessagePattern('get_article')
  public async edit(@Payload('value') id: string): Promise<ArticleResource> {
    return ArticleResource.one(await this.articleService.getOne(id));
  }

  @MessagePattern('store_article')
  public async store(@Payload('value') request: CreateArticleRequest): Promise<ArticleResource> {
    return ArticleResource.one(await this.articleService.store(new CreateArticleDTO().transform(request)));
  }

  @MessagePattern('update_article')
  public async update(@Payload('value') request: UpdateArticleRequest): Promise<string> {
    const dto = new UpdateArticleDTO().transform(request);
    await this.articleService.update(dto.id, dto);

    return 'Updated';
  }

  @MessagePattern('destroy_article')
  public async destroy(@Payload('value') id: string): Promise<string> {
    await this.articleService.delete(id);
    this.reviewService.emit('article_deleted', id);

    return 'Deleted';
  }

  @EventPattern('user_deleted')
  public userDeleted(@Payload('value') user_uuid: string): void {
    this.articleService.setNullableForDeletedUser(user_uuid);
  }
}
