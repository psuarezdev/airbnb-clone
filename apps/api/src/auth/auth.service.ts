import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { EXPIRES_IN, REFRESH_EXPIRES_IN } from './auth.module';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto);

    const payload = { sub: user.id, name: user.name };

    return {
      ...user,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_EXPIRES_IN,
        secret: process.env.JWT_REFRESH_SECRET
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRES_IN)
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async refresh(user: User) {
    const payload = { sub: user.id, name: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: EXPIRES_IN,
        secret: process.env.JWT_REFRESH_SECRET
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRES_IN)
    };
  }

  async validateUser(authDto: AuthDto) {
    // In this case the username is the email
    const userFound = await this.userService.findByEmail(authDto.username);

    if (!userFound || !(await compare(authDto.password, userFound.password))) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = userFound;
    return user;
  }
}
