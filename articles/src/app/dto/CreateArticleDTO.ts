import { PipeTransform } from '@nestjs/common';
import { CreateArticleRequest } from '../requests/CreateArticleRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class CreateArticleDTO implements PipeTransform {
  transform(request: RequestWithUser): CreateArticleRequest {
    return {
      user_uuid: request.user.uuid,
      title: request.body.title,
      description: request.body.description,
      text: request.body.text,
    };
  }
}
