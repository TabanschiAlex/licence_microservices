import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './exceptions/AllExceptionsFilter';
import { ArticleController } from './controllers/ArticleController';
import { AuthController } from './controllers/AuthController';
import { ReviewController } from './controllers/ReviewController';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['172.18.0.3:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
      {
        name: 'ARTICLES_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'articles',
            brokers: ['172.18.0.3:9092'],
          },
          consumer: {
            groupId: 'articles-consumer',
          },
        },
      },
      {
        name: 'REVIEWS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'reviews',
            brokers: ['172.18.0.3:9092'],
          },
          consumer: {
            groupId: 'reviews-consumer',
          },
        },
      },
    ]),
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  controllers: [ArticleController, AuthController, ReviewController],
})
export class AppModule {}
