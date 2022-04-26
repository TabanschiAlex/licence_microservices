import { Module } from '@nestjs/common';
import { AuthService } from './AuthService';
import { AuthController } from './AuthController';
import { UserService } from './UserService';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './UserController';
import { User } from './entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtAuthGuard]
})
export class AuthModule {}
