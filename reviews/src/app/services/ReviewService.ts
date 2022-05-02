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

  public async getOne(id: string): Promise<Review> {
    return await this.reviewRepository.findOneOrFail(id);
  }

  public async store(request: CreateReviewRequest): Promise<Review> {
    return await this.reviewRepository.save(request);
  }

  public async update(id: string, request: object | QueryDeepPartialEntity<Review>): Promise<UpdateResult> {
    return await this.reviewRepository.update(id, request);
  }

  public async delete(id: string): Promise<DeleteResult> {
    await this.reviewRepository.findOneOrFail(id);

    return await this.reviewRepository.delete(id);
  }
}
