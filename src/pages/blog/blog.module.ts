import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schema/blog.schema';
import { JwtModule } from '@nestjs/jwt';

import { NotificationModule } from '../../shared/notification/notification.module';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
    ]),
    NotificationModule,
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
