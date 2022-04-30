import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/AuthService';
import { AppController } from './controllers/AppController';
import { UserService } from './services/UserService';
import { User } from './entities/User';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/AllExceptionsFilter';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_KEY,
        signOptions: {
          expiresIn: '16d',
        },
      }),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AuthService,
    UserService,
  ],
})
export class AppModule {}
