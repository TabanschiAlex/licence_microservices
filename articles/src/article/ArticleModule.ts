import { Module } from '@nestjs/common';
import { Article } from './entities/Article';
import { ArticleController } from './ArticleController';
import { ArticleService } from './ArticleService';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
