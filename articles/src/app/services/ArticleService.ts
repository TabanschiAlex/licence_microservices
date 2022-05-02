import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Article } from '../entities/Article';
import { CreateArticleRequest } from '../requests/CreateArticleRequest';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka,
  ) {}

  public async getAll(query: BasicQueryRequest): Promise<Article[]> {
    const skip = query?.page ? (query?.page?.number - 1) * query?.page?.number : 0;
    const take = query?.page?.size ?? 10;

    return await this.articleRepository.find({ skip, take });
  }

  public async getOne(id: string): Promise<Article> {
    return this.articleRepository.findOneOrFail(id);
  }

  public async store(request: CreateArticleRequest): Promise<Article> {
    const article = new Article();

    article.title = request.title;
    article.description = request.description;
    article.text = request.text;
    article.user_uuid = request.user_uuid;

    return await this.articleRepository.save(request);
  }

  public async update(id: string, request: object | QueryDeepPartialEntity<Article>): Promise<UpdateResult> {
    return await this.articleRepository.update(id, request);
  }

  public async delete(id: string): Promise<DeleteResult> {
    await this.articleRepository.findOneOrFail(id);

    return await this.articleRepository.delete(id);
  }

  public setNullableForDeletedUser(user_uuid) {
    this.articleRepository
      .update({ user_uuid }, { user_uuid: null })
      .then(() => {
        console.log(`Articles with user ${user_uuid} is set to null`);
      })
      .catch(() => console.error(`Error to set null to user ${user_uuid}`));
  }
}
