import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  allFileFilter,
  editFileName,
  getUploadFilePath,
  getUploadImagePath,
  imageFileFilter,
} from './file-upload.utils';
import { UploadService } from './upload.service';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { imageSize } from 'image-size';
import {
  FileUploadResponse,
  ImageUploadResponse,
  ResponsePayload,
} from '../../interfaces/response-payload.interface';

@Controller('upload')
export class UploadController {
  private logger = new Logger(UploadController.name);

  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
  ) {}

  /**
   * IMAGE CONTROL METHODS
   * uploadSingleImage()
   * uploadSingleImageV2()
   * uploadMultipleImages()
   * uploadMultipleImagesV2()
   * seeUploadedImage()
   * deleteSingleImage()
   * deleteMultipleImage()
   */
  @Post('single-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: getUploadImagePath,
        filename: editFileName,
      }),
      limits: {
        fileSize: 10 * 1000 * 1000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');
    const path = file.path;
    const url = `${baseurl}/${path}`;
    return {
      originalname: file.originalname,
      filename: file.filename,
      url,
    };
  }

  // NEW
  @Version('2')
  @Post('single-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: getUploadImagePath,
        filename: editFileName,
      }),
      limits: {
        fileSize: 10 * 1000 * 1000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadSingleImageV2(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() body: any,
  ) {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    if (
      body &&
      body['convert'] &&
      body['convert'].toString().toLowerCase() === 'yes'
    ) {
      const quality: number = body['quality'] ? Number(body['quality']) : 85;
      const width: number = body['width'] ? Number(body['width']) : null;
      const height: number = body['height'] ? Number(body['height']) : null;

      const dir = `upload/images`;
      const filename = path.parse(file.filename).name;
      const newFilename = filename + '.webp';
      const newPath = `${dir}/${newFilename}`;

      const metaData = await sharp(file.path)
        .resize(width, height)
        .webp({ effort: 4, quality: quality })
        .withMetadata()
        .toFile(path.join(dir, newFilename));

      const baseurl =
        req.protocol +
        `${isProduction ? 's' : ''}://` +
        req.get('host') +
        (prefix ? `/${prefix}` : '');

      const url = `${baseurl}/${newPath}?resolution=${metaData.width}_${metaData.height}`;

      // Delete Images
      fs.unlinkSync('./' + file.path);

      return {
        originalname: file.originalname,
        filename: file.filename,
        format: metaData.format,
        width: metaData.width,
        height: metaData.height,
        size: this.uploadService.bytesToKb(metaData.size),
        url,
      };
    } else {
      const metaData = imageSize(file.path);
      const baseurl =
        req.protocol +
        `${isProduction ? 's' : ''}://` +
        req.get('host') +
        (prefix ? `/${prefix}` : '');
      const path = file.path;
      const url = `${baseurl}/${path}?resolution=${metaData.width}_${metaData.height}`;
      return {
        originalname: file.originalname,
        filename: file.filename,
        format: metaData.type,
        width: metaData.width,
        height: metaData.height,
        size: this.uploadService.bytesToKb(file.size),
        url,
      };
    }
  }

  @Post('multiple-image')
  @UseInterceptors(
    FilesInterceptor('imageMulti', 50, {
      storage: diskStorage({
        destination: getUploadImagePath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<ImageUploadResponse[]> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');
    const response: ImageUploadResponse[] = [];
    files.forEach((file) => {
      const fileResponse = {
        size: this.uploadService.bytesToKb(file.size),
        name: file.filename.split('.')[0],
        url: `${baseurl}/${file.path}`,
      } as ImageUploadResponse;
      response.push(fileResponse);
    });
    return response;
  }

  @Version('2')
  @Post('multiple-image')
  @UseInterceptors(
    FilesInterceptor('imageMulti', 50, {
      storage: diskStorage({
        destination: getUploadImagePath,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleImagesV2(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
    @Body() body: any,
  ): Promise<ImageUploadResponse[]> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');

    if (
      body &&
      body['convert'] &&
      body['convert'].toString().toLowerCase() === 'yes'
    ) {
      const quality: number = body['quality'] ? Number(body['quality']) : 85;
      const width: number = body['width'] ? Number(body['width']) : null;
      const height: number = body['height'] ? Number(body['height']) : null;
      const dir = `upload/images`;
      const response: ImageUploadResponse[] = [];

      for (const file of files) {
        const filename = path.parse(file.filename).name;
        const newFilename = filename + '.webp';
        const newPath = `${dir}/${newFilename}`;

        const metaData = await sharp(file.path)
          .resize(width, height)
          .webp({ effort: 4, quality: quality })
          .withMetadata()
          .toFile(path.join(dir, newFilename));

        // Delete Images
        fs.unlinkSync('./' + file.path);

        const fileResponse = {
          size: this.uploadService.bytesToKb(metaData.size),
          name: file.filename.split('.')[0],
          url: `${baseurl}/${newPath}?resolution=${metaData.width}_${metaData.height}`,
          format: metaData.format,
          width: metaData.width,
          height: metaData.height,
        } as ImageUploadResponse;
        response.push(fileResponse);
      }

      return response;
    } else {
      const response: ImageUploadResponse[] = [];
      files.forEach((file) => {
        const metaData = imageSize(file.path);
        const fileResponse = {
          size: this.uploadService.bytesToKb(file.size),
          name: file.filename.split('.')[0],
          url: `${baseurl}/${file.path}?resolution=${metaData.width}_${metaData.height}`,
          format: metaData.type,
          width: metaData.width,
          height: metaData.height,
        } as ImageUploadResponse;
        response.push(fileResponse);
      });
      return response;
    }
  }

  @Get('images/:imageName')
  async seeUploadedImage(
    @Param('imageName') image: string,
    @Query('w') width: string,
    @Query('auto') auto: string,
    @Res() res: any,
  ) {
    const file = await this.uploadService.imageGenerator(image, width, auto);
    return res.sendFile(file, { root: './upload/images' });
  }

  @Post('delete-single-image')
  deleteSingleImage(
    @Body('url') url: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');

    const onlyUrl = url.replace(/\?.*/, '');
    const path = `.${onlyUrl.replace(baseurl, '')}`;
    return this.uploadService.deleteSingleFile(path);
  }

  @Post('delete-multiple-image')
  deleteMultipleImage(
    @Body('url') url: string[],
    @Req() req: any,
  ): Promise<ResponsePayload> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');
    return this.uploadService.deleteMultipleImage(baseurl, url);
  }

  /**
   * File CONTROL METHODS
   * uploadMultipleFiles()
   * seeUploadedFile()
   * deleteMultipleFile()
   */

  @Post('multiple-file')
  @UseInterceptors(
    FilesInterceptor('fileMulti', 50, {
      storage: diskStorage({
        destination: getUploadFilePath,
        filename: editFileName,
      }),
      fileFilter: allFileFilter,
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<FileUploadResponse[]> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');
    const response: FileUploadResponse[] = [];
    files.forEach((file) => {
      const fileResponse = {
        extension: file.filename.split('.')[1]?.toLowerCase(),
        size: this.uploadService.bytesToKb(file.size),
        name: file.filename.split('.')[0],
        url: `${baseurl}/${file.path}`,
      } as FileUploadResponse;
      response.push(fileResponse);
    });
    return response;
  }
  @Get('files/:name')
  async seeUploadedFile(@Param('name') file: string, @Res() res: any) {
    return res.sendFile(file, { root: './upload/files' });
  }

  @Post('delete-multiple-file')
  deleteMultipleFile(
    @Body('url') url: string[],
    @Req() req: any,
  ): Promise<ResponsePayload> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const prefix = this.configService.get<string>('prefix');
    const baseurl =
      req.protocol +
      `${isProduction ? 's' : ''}://` +
      req.get('host') +
      (prefix ? `/${prefix}` : '');
    return this.uploadService.deleteMultipleFile(baseurl, url);
  }
}
