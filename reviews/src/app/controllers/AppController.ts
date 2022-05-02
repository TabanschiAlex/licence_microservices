import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from '../services/ReviewService';
import { ReviewResource } from '../resources/ReviewResource';
import { CreateReviewRequest } from '../requests/CreateReviewRequest';
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { QueryDTO } from '../dto/QueryDTO';
import { CreateReviewDTO } from '../dto/CreateReviewDTO';
import { UpdateReviewDTO } from '../dto/UpdateReviewDTO';

@Controller('reviews')
@UsePipes(ValidationPipe)
export class AppController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern('get_reviews')
  public async index(@Payload('value') query: BasicQueryRequest): Promise<ReviewResource> {
    return ReviewResource.factory(await this.reviewService.getAll(new QueryDTO().transform(query)));
  }

  @MessagePattern('get_review')
  public async edit(@Payload('value') id: string) {
    return ReviewResource.one(await this.reviewService.getOne(id));
  }

  @MessagePattern()
  public async store(@Payload('value') request: CreateReviewRequest): Promise<ReviewResource> {
    return ReviewResource.one(await this.reviewService.store(new CreateReviewDTO().transform(request)));
  }

  @MessagePattern('update_review')
  public async update(@Payload('value') request: UpdateReviewRequest): Promise<string> {
    const dto = new UpdateReviewDTO().transform(request);
    await this.reviewService.update(dto.id, dto);

    return 'Updated';
  }

  @MessagePattern('destroy_review')
  public async destroy(@Payload('value') id: string): Promise<string> {
    await this.reviewService.delete(id);

    return 'Deleted';
  }

  /*@EventPattern('user_deleted')
  public async userDeleted(@Payload('value') user_uuid: string) {}

  @EventPattern('article_deleted')
  public async articleDeleted(@Payload('value') id: string) {}*/
}
