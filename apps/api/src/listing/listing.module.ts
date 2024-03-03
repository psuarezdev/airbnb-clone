import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ListingController],
  providers: [ListingService, PrismaService]
})
export class ListingModule {}
