import { PipeTransform } from '@nestjs/common';
import { CreateReviewRequest } from '../requests/CreateReviewRequest';

export class CreateReviewDTO implements PipeTransform {
  transform(review: CreateReviewRequest): CreateReviewRequest {
    return {
      text: review.text,
      article_id: review.article_id,
      user_uuid: review.user_uuid,
    };
  }
}
