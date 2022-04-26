import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './AuthService';
import { AuthLoginRequest } from './requests/auth/AuthLoginRequest';
import { LoginDTO } from './dto/LoginDTO';
import { RegisterDTO } from './dto/RegisterDTO';
import { AuthRegisterRequest } from './requests/auth/AuthRegisterRequest';
import { AuthResource } from './resources/auth/AuthResource';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login')
  public async login(@Payload(LoginDTO) request: AuthLoginRequest): Promise<AuthResource> {
    return await this.authService.login(request);
  }

  @MessagePattern('register')
  public async register(@Payload(RegisterDTO) request: AuthRegisterRequest): Promise<AuthResource> {
    return await this.authService.register(request);
  }
}
