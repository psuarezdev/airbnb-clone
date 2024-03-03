import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async findUserReservations(requestQuery: any) {
    const { listingId, userId, authorId } = requestQuery;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    return await this.prisma.reservation.findMany({
      where: query,
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findUserReservation(userId: string, id: string) {
    return await this.prisma.reservation.findUnique({
      where: {
        id,
        listing: { userId }
      },
      include: {
        listing: true
      }
    });
  }

  async create(createReservationDto: CreateReservationDto) {
    const { userId } = createReservationDto;

    const userFound = await this.userService.findOne(userId);

    if (!userFound) throw new BadRequestException('User not found');

    return await this.prisma.reservation.create({
      data: createReservationDto,
      include: {
        listing: true
      }
    });
  }

  async remove(userId: string, id: string) {
    const reservationFound = await this.prisma.reservation.findUnique({
      where: {
        id,
        OR: [{ userId }, { listing: { userId } }]
      }
    });

    if (!reservationFound) {
      throw new BadRequestException('Reservation not found');
    }

    return await this.prisma.reservation.delete({
      where: { id, OR: [{ userId }, { listing: { userId } }] }
    });
  }
}
