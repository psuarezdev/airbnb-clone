import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { ListingService } from 'src/listing/listing.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ListingService]
})
export class UserModule {}
