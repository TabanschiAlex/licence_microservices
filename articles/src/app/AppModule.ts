import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/AllExceptionsFilter';
import { AppController } from './controllers/AppController';
import { ArticleService } from './services/ArticleService';
import { ConfigModule } from '@nestjs/config';
import { Article } from './entities/Article';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
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
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    ArticleService,
  ],
})
export class AppModule {}
