import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Review } from './entities/Review';
import { AppController } from './controllers/AppController';
import { ReviewService } from './services/ReviewService';
import { AllExceptionsFilter } from './exceptions/AllExceptionsFilter';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Review])],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    ReviewService,
  ],
})
export class AppModule {}
