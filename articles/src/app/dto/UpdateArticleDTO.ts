import { PipeTransform } from '@nestjs/common';
import { UpdateArticleRequest } from '../requests/UpdateArticleRequest';

export class UpdateArticleDTO implements PipeTransform {
  transform(article: UpdateArticleRequest): UpdateArticleRequest {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      text: article.text,
    };
  }
}
