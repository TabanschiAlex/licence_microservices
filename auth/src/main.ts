import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/AuthModule';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const bootstrap = async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:8001'],
      }
    }
  });
  await app.listen();
}

bootstrap();
