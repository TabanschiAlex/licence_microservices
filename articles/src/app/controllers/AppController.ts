import { Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ArticleService } from '../services/ArticleService';
import { ArticleResource } from '../resources/ArticleResource';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateArticleDTO } from '../dto/CreateArticleDTO';
import { UpdateArticleDTO } from '../dto/UpdateArticleDTO';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { UserRestrict } from '../guards/UserRestrict';

@Controller('articles')
@UsePipes(ValidationPipe)
export class AppController {
  constructor(
    private readonly articleService: ArticleService,
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka,
  ) {}

  @MessagePattern('get_articles')
  public async index(@Payload('value') request: RequestWithUser): Promise<ArticleResource> {
    return ArticleResource.factory(await this.articleService.getAll(new QueryDTO().transform(request)));
  }

  @MessagePattern('get_article')
  public async edit(@Payload('value') request: RequestWithUser): Promise<ArticleResource> {
    return ArticleResource.one(await this.articleService.getOne(request.body.id));
  }

  @MessagePattern('store_article')
  public async store(@Payload('value') request: RequestWithUser): Promise<ArticleResource> {
    UserRestrict.canAccess(request.user.role);

    return ArticleResource.one(await this.articleService.store(new CreateArticleDTO().transform(request)));
  }

  @MessagePattern('update_article')
  public async update(@Payload('value') request: RequestWithUser): Promise<string> {
    UserRestrict.canAccess(request.user.role);
    const dto = new UpdateArticleDTO().transform(request);
    await this.articleService.update(dto.id, dto);

    return 'Updated';
  }

  @MessagePattern('destroy_article')
  public async destroy(@Payload('value') request: RequestWithUser): Promise<string> {
    UserRestrict.canAccess(request.user.role);
    await this.articleService.delete(request.body.id);
    this.reviewService.emit('article_deleted', request.body.id);

    return 'Deleted';
  }

  @EventPattern('user_deleted')
  public userDeleted(@Payload('value') user_uuid: string): void {
    this.articleService.setNullableForDeletedUser(user_uuid);
  }
}
