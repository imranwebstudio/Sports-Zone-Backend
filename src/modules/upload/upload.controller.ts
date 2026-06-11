import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const result = await this.cloudinary.uploadBuffer(file.buffer, file.mimetype);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
