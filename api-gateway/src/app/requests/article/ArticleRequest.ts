import { IsString } from 'class-validator';

export class ArticleRequest {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  text: string;
}
