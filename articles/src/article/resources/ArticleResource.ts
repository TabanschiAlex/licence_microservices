import { Article } from '../entities/Article';

export class ArticleResource {
  public static one(article: Article) {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      text: article.text,
      user: article.user,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  /*public static withReviews(article: Article) {
    const oneArticle: any = this.one(article);
    oneArticle.reviews = ReviewResource.factory(article.reviews);

    return oneArticle;
  }*/

  public static factory(articles: Article[]): Record<string, any> {
    return articles.map((article) => this.one(article));
  }
}
