import { Review } from '../entities/Review';

export class ReviewResource {
  public static one(review: Review) {
    return {
      id: review.id,
      text: review.text,
      user_uuid: review.user_uuid,
      article_id: review.article_id,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  public static factory(reviews: Review[]): Record<string, any> {
    return reviews.map((user) => this.one(user));
  }
}
