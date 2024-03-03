import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ListingService } from 'src/listing/listing.service';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, PrismaService, UserService, ListingService]
})
export class ReservationModule {}
