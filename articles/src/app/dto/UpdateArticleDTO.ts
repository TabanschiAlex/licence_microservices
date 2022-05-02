import { PipeTransform } from '@nestjs/common';
import { UpdateArticleRequest } from '../requests/UpdateArticleRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class UpdateArticleDTO implements PipeTransform {
  transform(request: RequestWithUser): UpdateArticleRequest {
    return {
      id: request.body.id,
      title: request.body.title,
      description: request.body.description,
      text: request.body.text,
    };
  }
}
