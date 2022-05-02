import { PipeTransform } from '@nestjs/common';
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class UpdateReviewDTO implements PipeTransform {
  transform(request: RequestWithUser): UpdateReviewRequest {
    return {
      id: request.body.id,
      text: request.body.text,
    };
  }
}
