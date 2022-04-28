import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './AuthService';
import { AppController } from './AppController';
import { UserService } from './UserService';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { User } from './entities/User';

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
  providers: [AuthService, UserService, JwtAuthGuard],
})
export class AppModule {}
