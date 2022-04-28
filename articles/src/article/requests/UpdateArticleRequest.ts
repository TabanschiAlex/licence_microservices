import { IsString } from 'class-validator';

export class UpdateArticleRequest {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly description?: string;

  @IsString()
  readonly text?: string;
}
