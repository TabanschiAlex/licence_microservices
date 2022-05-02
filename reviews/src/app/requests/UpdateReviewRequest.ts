export class UpdateReviewRequest {
  constructor(readonly id: number, readonly text: string, readonly user_uuid: string, readonly article_id: number) {}
}
