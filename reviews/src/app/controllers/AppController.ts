import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from '../services/ReviewService';
import { ReviewResource } from '../resources/ReviewResource';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateReviewDTO } from '../dto/CreateReviewDTO';
import { UpdateReviewDTO } from '../dto/UpdateReviewDTO';
import { RequestWithUser } from '../interfaces/RequestWithUser';

@Controller()
@UsePipes(ValidationPipe)
export class AppController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern('get_reviews')
  public async index(@Payload('value') request: RequestWithUser): Promise<ReviewResource> {
    return ReviewResource.factory(await this.reviewService.getAll(new QueryDTO().transform(request)));
  }

  @MessagePattern('get_review')
  public async edit(@Payload('value') request: RequestWithUser) {
    return ReviewResource.one(await this.reviewService.getOne(request.body.id));
  }

  @MessagePattern('get_review')
  public async store(@Payload('value') request: RequestWithUser): Promise<ReviewResource> {
    return ReviewResource.one(await this.reviewService.store(new CreateReviewDTO().transform(request)));
  }

  @MessagePattern('update_review')
  public async update(@Payload('value') request: RequestWithUser): Promise<string> {
    const dto = new UpdateReviewDTO().transform(request);
    await this.reviewService.update(dto.id, dto);

    return 'Updated';
  }

  @MessagePattern('destroy_review')
  public async destroy(@Payload('value') request: RequestWithUser): Promise<string> {
    await this.reviewService.delete(request.body.id);

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
