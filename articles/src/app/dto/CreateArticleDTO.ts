import { PipeTransform } from '@nestjs/common';
import { CreateArticleRequest } from '../requests/CreateArticleRequest';

export class CreateArticleDTO implements PipeTransform {
  transform(article: CreateArticleRequest): CreateArticleRequest {
    return {
      user_uuid: article.user_uuid,
      title: article.title,
      description: article.description,
      text: article.text,
    };
  }
}
