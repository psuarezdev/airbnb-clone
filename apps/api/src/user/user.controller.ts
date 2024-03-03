import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'node:fs';

export const storagePath = './src/uploads/avatars';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async profile(@Req() req: Request) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.findOne(sub);
  }

  @Get('favorites')
  @UseGuards(JwtGuard)
  async favorites(@Req() req: Request) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.findFavorites(sub);
  }

  @Get('avatar/:filename')
  async getAvatar(@Param('filename') filename: string) {
    const file = createReadStream(`${storagePath}/${filename}`);
    return new StreamableFile(file);
  }

  @Get('properties')
  @UseGuards(JwtGuard)
  async properties(@Req() req: Request) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.findProperties(sub);
  }

  @Get('favorites-listings')
  @UseGuards(JwtGuard)
  async findFavorites(@Req() req: Request) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.findFavorites(sub);
  }

  @Patch('avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: storagePath,
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        }
      })
    })
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const { filename, mimetype } = file;
    const { sub } = req.user as JwtPayload;
    this.userService.updateAvatar(sub, filename);
    return { filename, mimetype };
  }

  @Post('favorites/:listingId')
  @UseGuards(JwtGuard)
  async addFavorite(
    @Req() req: Request,
    @Param('listingId') listingId: string
  ) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.addFavorite(sub, listingId);
  }

  @Delete('favorites/:listingId')
  @UseGuards(JwtGuard)
  async removeFavorite(
    @Req() req: Request,
    @Param('listingId') listingId: string
  ) {
    const { sub } = req.user as JwtPayload;
    return await this.userService.removeFavorite(sub, listingId);
  }
}
