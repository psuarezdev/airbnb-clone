import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ListingService } from 'src/listing/listing.service';

export const EXPIRES_IN = 5 * 60 * 60 * 1000;
export const REFRESH_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: EXPIRES_IN }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    ListingService,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule {}
