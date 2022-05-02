export class UpdateArticleRequest {
  constructor(readonly id: string, readonly title: string, readonly description: string, readonly text: string) {}
}
