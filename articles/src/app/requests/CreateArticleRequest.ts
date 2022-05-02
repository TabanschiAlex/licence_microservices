export class CreateArticleRequest {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly text: string,
    readonly user_uuid: string,
  ) {}
}
