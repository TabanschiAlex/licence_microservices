import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ArticleRequest } from '../requests/ArticleRequest';

export class ArticleDTO implements PipeTransform {
  transform(article: ArticleRequest, metadata: ArgumentMetadata): ArticleRequest {
    return {
      title: article.title,
      description: article.description,
      text: article.text,
    };
  }
}
