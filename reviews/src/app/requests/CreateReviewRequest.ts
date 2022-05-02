export class CreateReviewRequest {
  constructor(readonly text: string, readonly user_uuid: string, readonly article_id: number) {}
}
