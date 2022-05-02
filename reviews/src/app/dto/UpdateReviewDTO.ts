import { PipeTransform } from '@nestjs/common';
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest';

export class UpdateReviewDTO implements PipeTransform {
  transform(review: UpdateReviewRequest): UpdateReviewRequest {
    return {
      id: review.id,
      text: review.text,
      article_id: review.article_id,
      user_uuid: review.user_uuid,
    };
  }
}
