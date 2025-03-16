import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { ResponsePayload } from '../../interfaces/response-payload.interface';

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor() {}

  async deleteSingleFile(path: string): Promise<ResponsePayload> {
    try {
      if (path) {
        const splitPath = path.split('/');
        const file = splitPath[splitPath.length - 1];
        const [fileName, fileType] = file.split('.');
        const dir = `./upload/images`;

        const wFiles: string[] = [
          `${dir}/${fileName}_384.${fileType}`,
          `${dir}/${fileName}_640.${fileType}`,
          `${dir}/${fileName}_750.${fileType}`,
          `${dir}/${fileName}_828.${fileType}`,
          `${dir}/${fileName}_1080.${fileType}`,
          `${dir}/${fileName}_1200.${fileType}`,
          `${dir}/${fileName}_1342.${fileType}`,
          `${dir}/${fileName}_1920.${fileType}`,
        ];
        for (const file of wFiles) {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        }

        fs.unlinkSync(path);
        return {
          success: true,
          message: 'Success! Image Successfully Removed.',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Error! No Path found',
        } as ResponsePayload;
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleImage(
    baseurl: string,
    url: string[],
  ): Promise<ResponsePayload> {
    try {
      if (url && url.length) {
        url.forEach((u) => {
          const onlyUrl = u.replace(/\?.*/, '');
          const path = `.${onlyUrl.replace(baseurl, '')}`;

          const splitPath = path.split('/');
          const file = splitPath[splitPath.length - 1];
          const [fileName, fileType] = file.split('.');
          const dir = `./upload/images`;

          const wFiles: string[] = [
            `${dir}/${fileName}_384.${fileType}`,
            `${dir}/${fileName}_640.${fileType}`,
            `${dir}/${fileName}_750.${fileType}`,
            `${dir}/${fileName}_828.${fileType}`,
            `${dir}/${fileName}_1080.${fileType}`,
            `${dir}/${fileName}_1200.${fileType}`,
            `${dir}/${fileName}_1342.${fileType}`,
            `${dir}/${fileName}_1920.${fileType}`,
          ];
          for (const file of wFiles) {
            if (fs.existsSync(file)) {
              fs.unlinkSync(file);
            }
          }

          fs.unlinkSync(path);
        });

        return {
          success: true,
          message: 'Success! Image Successfully Removed.',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Error! No Path found',
        } as ResponsePayload;
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFile(
    baseurl: string,
    url: string[],
  ): Promise<ResponsePayload> {
    try {
      if (url && url.length) {
        url.forEach((u) => {
          const path = `.${u.replace(baseurl, '')}`;
          fs.unlinkSync(path);
        });

        return {
          success: true,
          message: 'Success! Files Successfully Removed.',
        } as ResponsePayload;
      } else {
        return {
          success: false,
          message: 'Error! No Path found',
        } as ResponsePayload;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async imageGenerator(
    image: string,
    width: string,
    auto: string,
  ): Promise<string> {
    try {
      const dir = `upload/images`;
      const originalFilePath = `./upload/images/${image}`;
      const placeholderFilePath = `placeholder.png`;

      // Check Request File Exists
      if (!fs.existsSync(originalFilePath)) {
        return placeholderFilePath;
      }

      // Check Request Width
      if (!width) {
        return image;
      }
      // Main Convert Width
      const [fileName, fileType] = image.split('.');
      const requestFilePath = `./upload/images/${fileName}_${width}.${fileType}`;
      let newFilename = `${fileName}_${width}.${fileType}`;

      if (!fs.existsSync(requestFilePath)) {
        const nWidth = +width;
        if (
          nWidth === 384 ||
          nWidth === 640 ||
          nWidth === 750 ||
          nWidth === 828 ||
          nWidth === 1080 ||
          nWidth === 1200 ||
          nWidth === 1342 ||
          nWidth === 1920
        ) {
          await sharp(originalFilePath)
            .resize(+width)
            .toFile(`${dir}/${newFilename}`);
        } else {
          newFilename = image;
        }
      }
      return newFilename;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  bytesToKb(bytes: number): number {
    const res = bytes * 0.001;
    return Number(res.toFixed(2));
  }
}
