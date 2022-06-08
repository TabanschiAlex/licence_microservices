import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/Review';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { CreateReviewRequest } from '../requests/CreateReviewRequest';

@Injectable()
export class ReviewService {
  constructor(@InjectRepository(Review) private readonly reviewRepository: Repository<Review>) {}

  public async getAll(query: BasicQueryRequest): Promise<Review[]> {
    const skip = query?.page ? (query?.page?.number - 1) * query?.page?.number : 0;
    const take = query?.page?.size ?? 10;

    return await this.reviewRepository.find({ skip, take });
  }

  public async getOne(id: number): Promise<Review> {
    return await this.reviewRepository.findOneOrFail(id);
  }

  public async store(request: CreateReviewRequest): Promise<Review> {
    return await this.reviewRepository.save(request);
  }

  public async update(
    id: number,
    request: object | QueryDeepPartialEntity<Review>,
    uuid?: string,
  ): Promise<UpdateResult> {
    await this.getReviewOrFail(id, uuid);

    return await this.reviewRepository.update(id, request);
  }

  public async delete(id: number, uuid?: string): Promise<DeleteResult> {
    await this.getReviewOrFail(id, uuid);

    return await this.reviewRepository.delete(id);
  }

  public deleteByUser(user_uuid: string): void {
    this.reviewRepository
      .delete({ user_uuid })
      .then(() => {
        console.log(`All review created by user ${user_uuid} deleted`);
      })
      .catch(() => {
        console.error(`Error deleting reviews created by user ${user_uuid}`);
      });
  }

  public deleteByArticle(article_id: number): void {
    this.reviewRepository
      .delete({ article_id })
      .then(() => {
        console.log(`All review linked with article ${article_id} deleted`);
      })
      .catch(() => {
        console.error(`Error deleting reviews linked with article ${article_id}`);
      });
  }

  private async getReviewOrFail(id: number, uuid?: string) {
    if (uuid) {
      return await this.reviewRepository.findOneOrFail(id, { where: { user_uuid: uuid } });
    }

    return await this.reviewRepository.findOneOrFail(id);
  }
}
