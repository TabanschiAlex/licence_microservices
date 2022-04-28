import { Injectable } from '@nestjs/common';
import { Article } from './entities/Article';
import { ArticleRequest } from './requests/ArticleRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { BasicQueryRequest } from './requests/BasicQueryRequest';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private readonly articleRepository: Repository<Article>) {}

  public async getAll(query: BasicQueryRequest): Promise<Article[]> {
    const skip = query?.page ? (query?.page?.number - 1) * query?.page?.number : 0;
    const take = query?.page?.size ?? 10;

    return await this.articleRepository.find({ skip, take });
  }

  public async getOne(id: string): Promise<Article> {
    return this.articleRepository.findOneOrFail(id, {
      loadEagerRelations: true,
      relations: ['reviews', 'reviews.user'],
    });
  }

  public async store(request: ArticleRequest): Promise<Article> {
    const article = new Article();

    article.title = request.title;
    article.description = request.description;
    article.text = request.text;
    article.user = request.user;

    return await this.articleRepository.save(request);
  }

  public async update(id: string, request: QueryDeepPartialEntity<Article>): Promise<UpdateResult> {
    return await this.articleRepository.update(id, request);
  }

  public async delete(id: string): Promise<DeleteResult> {
    await this.articleRepository.findOneOrFail(id);

    return await this.articleRepository.delete(id);
  }
}
