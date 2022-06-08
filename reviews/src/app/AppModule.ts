import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Review } from './entities/Review';
import { AppController } from './controllers/AppController';
import { ReviewService } from './services/ReviewService';
import { AllExceptionsFilter } from './exceptions/AllExceptionsFilter';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ARTICLE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'articles',
            brokers: ['172.18.0.3:9092'],
          },
          consumer: {
            groupId: 'articles-consumer1',
          },
        },
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Review]),
  ],
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
