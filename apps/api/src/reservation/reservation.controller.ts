import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  // @UseGuards(JwtGuard)
  async findUserReservations(@Query() query: any) {
    return await this.reservationService.findUserReservations(query);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findUserReservation(@Req() req: Request, @Param('id') id: string) {
    const { sub } = req.user as JwtPayload;
    return await this.reservationService.findUserReservation(sub, id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationService.create(createReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const { sub } = req.user as JwtPayload;
    return await this.reservationService.remove(sub, id);
  }
}
