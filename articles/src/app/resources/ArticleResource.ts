import { Article } from '../entities/Article';

export class ArticleResource {
  public static one(article: Article) {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      text: article.text,
      user_uuid: article.user_uuid,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  public static factory(articles: Article[]): Record<string, any> {
    return articles.map((article) => this.one(article));
  }
}
