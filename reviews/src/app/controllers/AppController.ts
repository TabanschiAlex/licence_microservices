import { Controller, Inject, OnModuleInit, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from '../services/ReviewService';
import { ReviewResource } from '../resources/ReviewResource';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateReviewDTO } from '../dto/CreateReviewDTO';
import { UpdateReviewDTO } from '../dto/UpdateReviewDTO';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { UserRestrict } from '../guards/UserRestrict';
import { timeout } from 'rxjs';

@Controller()
@UsePipes(ValidationPipe)
export class AppController implements OnModuleInit {
  constructor(
    private readonly reviewService: ReviewService,
    @Inject('ARTICLE_SERVICE') private readonly articleService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.articleService.subscribeToResponseOf('get_article');
    await this.articleService.connect();
  }

  @MessagePattern('get_reviews')
  public async index(@Payload('value') request: RequestWithUser): Promise<ReviewResource> {
    return ReviewResource.factory(await this.reviewService.getAll(new QueryDTO().transform(request)));
  }

  @MessagePattern('get_review')
  public async edit(@Payload('value') request: RequestWithUser) {
    return ReviewResource.one(await this.reviewService.getOne(request.body.id));
  }

  @MessagePattern('store_review')
  public async store(@Payload('value') request: RequestWithUser): Promise<ReviewResource> {
    const dto = new CreateReviewDTO().transform(request);

    await this.articleService
      .send('get_article', { body: { id: dto.article_id } })
      .pipe(timeout(5000))
      .toPromise();

    return ReviewResource.one(await this.reviewService.store(dto));
  }

  @MessagePattern('update_review')
  public async update(@Payload('value') request: RequestWithUser): Promise<string> {
    const dto = new UpdateReviewDTO().transform(request);
    const scope = UserRestrict.applyScope(request.user, dto.id);
    await this.reviewService.update(dto.id, dto, scope.uuid);

    return 'Updated';
  }

  @MessagePattern('destroy_review')
  public async destroy(@Payload('value') request: RequestWithUser): Promise<string> {
    const scope = UserRestrict.applyScope(request.user, request.body.id);
    await this.reviewService.delete(scope.id, scope.uuid);

    return 'Deleted';
  }

  @EventPattern('user_deleted')
  public userDeleted(@Payload('value') user_uuid: string): void {
    this.reviewService.deleteByUser(user_uuid);
  }

  @EventPattern('article_deleted')
  public articleDeleted(@Payload('value') id: number): void {
    this.reviewService.deleteByArticle(id);
  }
}
