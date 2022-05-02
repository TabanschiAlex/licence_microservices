import { PipeTransform } from '@nestjs/common';
import { CreateReviewRequest } from '../requests/CreateReviewRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class CreateReviewDTO implements PipeTransform {
  transform(request: RequestWithUser): CreateReviewRequest {
    return {
      text: request.body.text,
      article_id: request.body.article_id,
      user_uuid: request.user.uuid,
    };
  }
}
