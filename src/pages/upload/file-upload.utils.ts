import { extname } from 'path';
import * as fs from 'fs';

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (
    !file.originalname.match(/\.(jpg|jpeg|png|gif|webp|PNG|JPG|JPEG|GIF|WEBP)$/)
  ) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const allFileFilter = (req: any, file: any, callback: any) => {
  // if (!file.originalname.match(/\.(pdf|PDF|doc|DOC|docx|DOCX)$/)) {
  if (!file.originalname.match(/\.(pdf|PDF|mp3|MP3)$/)) {
    // return callback(new Error('Only pdf or docx files are allowed!'), false);
    return callback(new Error('Only pdf files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req: any, file: any, callback: any) => {
  const name = transformToSlug(file.originalname.split('.')[0]);
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const getUploadImagePath = (req: any, file: any, callback: any) => {
  const dir = `./upload/images`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return callback(null, dir);
};

export const getUploadFilePath = (req: any, file: any, callback: any) => {
  const dir = `./upload/files`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return callback(null, dir);
};

const transformToSlug = (value: string): string => {
  return value
    .trim()
    .replace(/[^A-Z0-9]+/gi, '-')
    .toLowerCase();
};
