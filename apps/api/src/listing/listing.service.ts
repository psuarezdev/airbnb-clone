import { unlink } from 'node:fs/promises';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(requestQuery: any) {
    const {
      category,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate
    } = requestQuery;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      };
    }

    return await this.prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    return await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
  }

  async findFavorites(favoriteIds: string[]) {
    if (!favoriteIds) {
      throw new BadRequestException('Favorite Ids are required');
    }

    return await this.prisma.listing.findMany({
      where: {
        id: { in: favoriteIds }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findProperties(userId: string) {
    if (!userId) throw new BadRequestException('User Id is required');

    return await this.prisma.listing.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async create(createListingDto: CreateListingDto) {
    return await this.prisma.listing.create({
      data: createListingDto
    });
  }

  async remove(userId: string, id: string) {
    if (!userId || !id) throw new BadRequestException('Ids are required');

    const listingFound = await this.prisma.listing.findFirst({
      where: { id, userId }
    });

    if (!listingFound) throw new BadRequestException('Listing not found');

    if (listingFound.imageSrc) {
      await unlink(`./src/uploads/listings/${listingFound.imageSrc}`);
    }

    return await this.prisma.listing.delete({
      where: { id, userId }
    });
  }
}
