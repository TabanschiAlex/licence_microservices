import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/AppModule';

const bootstrap = async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
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
  });
  await app.listen();
};

bootstrap();
