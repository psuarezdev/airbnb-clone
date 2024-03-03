import { unlink } from 'node:fs/promises';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'bcrypt';
import { ListingService } from 'src/listing/listing.service';
import { storagePath } from './user.controller';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingService: ListingService
  ) {}

  async findOne(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    const userFound = await this.prisma.user.findUnique({ where: { id } });
    if (!userFound) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userFound;
    return user;
  }

  async findByEmail(email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const userFound = await this.prisma.user.findUnique({ where: { email } });
    if (!userFound) throw new NotFoundException('User not found');

    return userFound;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const userFound = await this.prisma.user.findUnique({
      where: { email }
    });

    if (userFound) throw new BadRequestException('User already exists');

    const securedPassword = await hash(password, 10);

    const userCreated = await this.prisma.user.create({
      data: {
        name,
        email,
        password: securedPassword
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = userCreated;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!id) throw new BadRequestException('Id is required');

    const userFound = await this.prisma.user.findUnique({ where: { id } });

    if (!userFound) throw new NotFoundException('User not found');

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userUpdated;
    return user;
  }

  async updateAvatar(id: string, filename: string) {
    if (!id || !filename) {
      throw new BadRequestException('Id and filename are required');
    }

    const userFound = await this.prisma.user.findUnique({ where: { id } });

    if (!userFound) throw new NotFoundException('User not found');

    if (userFound.image) {
      await unlink(`${storagePath}/${userFound.image}`);
    }

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: { image: filename }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userUpdated;
    return user;
  }

  async findProperties(userId: string) {
    return await this.listingService.findProperties(userId);
  }

  async findFavorites(userId: string) {
    if (!userId) throw new BadRequestException('Id is required');

    const userFound = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userFound) throw new NotFoundException('User not found');

    const favorites = await this.listingService.findFavorites(
      userFound.favoriteIds
    );

    if (!favorites) throw new NotFoundException('Favorites not found');

    return favorites;
  }

  async addFavorite(userId: string, listingId: string) {
    if (!userId || !listingId) {
      throw new BadRequestException('User id and listing id are required');
    }

    const userFound = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userFound) throw new NotFoundException('User not found');

    const listingFound = await this.listingService.findOne(listingId);

    if (!listingFound) throw new NotFoundException('Listing not found');

    const userUpdated = await this.prisma.user.update({
      where: { id: userId },
      data: { favoriteIds: { push: listingId } }
    });

    if (!userUpdated) {
      throw new InternalServerErrorException('Failed to add favorite');
    }

    return listingFound;
  }

  async removeFavorite(userId: string, listingId: string) {
    if (!userId || !listingId) {
      throw new BadRequestException('User id and listing id are required');
    }

    const userFound = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userFound) throw new NotFoundException('User not found');

    const listingFound = await this.listingService.findOne(listingId);

    if (!listingFound) throw new NotFoundException('Listing not found');

    const userUpdated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteIds: {
          set: userFound.favoriteIds.filter((id) => id !== listingId)
        }
      }
    });

    if (!userUpdated) {
      throw new InternalServerErrorException('Failed to remove favorite');
    }

    return listingFound;
  }
}
