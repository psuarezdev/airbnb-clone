import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { createReadStream } from 'node:fs';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

const storagePath = './src/uploads/listings';

@Controller('listings')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.listingService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.listingService.findOne(id);
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string) {
    const file = createReadStream(`${storagePath}/${filename}`);
    return new StreamableFile(file);
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createListingDto: CreateListingDto) {
    return await this.listingService.create(createListingDto);
  }

  @Post('upload')
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
  upload(@UploadedFile() file: Express.Multer.File) {
    const { filename, mimetype } = file;
    return { filename, mimetype };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const { sub } = req.user as JwtPayload;
    return await this.listingService.remove(sub, id);
  }
}
