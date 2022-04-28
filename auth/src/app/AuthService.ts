import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './UserService';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/User';
import { AuthLoginRequest } from './requests/auth/AuthLoginRequest';
import { AuthResource } from './resources/auth/AuthResource';
import { AuthRegisterRequest } from './requests/auth/AuthRegisterRequest';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  public async login(request: AuthLoginRequest): Promise<AuthResource> {
    return this.generateToken(await this.validateUser(request));
  }

  public async register(request: AuthRegisterRequest): Promise<AuthResource> {
    if (await this.userService.getUserByEmail(request.email)) {
      throw new UnprocessableEntityException('Email already registered!');
    }

    AuthService.checkPasswordsIdentity(request.password, request.passwordConfirmation);

    const hashedPassword = await this.userService.hashPassword(request.password);
    const user = await this.userService.create({
      ...request,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  private static checkPasswordsIdentity(password: string, passwordConfirmation: string): void {
    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Password does not match');
    }
  }

  private async generateToken(user: User): Promise<AuthResource> {
    const payload = { uuid: user.uuid, email: user.email, role: user.role };

    return new AuthResource(user, this.jwtService.sign(payload));
  }

  private async validateUser(authDto: AuthLoginRequest): Promise<User> {
    const user = await this.userService.getUserByEmail(authDto.email);

    if (!user && !(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('Password does not match');
    }

    return user;
  }
}
