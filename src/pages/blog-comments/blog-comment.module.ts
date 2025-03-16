import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentService } from './blog-comment.service';
import { JwtModule } from '@nestjs/jwt';
import { BlogCommentSchema } from './schema/blog-comment.schema';
import { BlogSchema } from '../blog/schema/blog.schema';
import { NotificationModule } from '../../shared/notification/notification.module';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'BlogComment', schema: BlogCommentSchema },
      { name: 'Blog', schema: BlogSchema },
    ]),
    NotificationModule,
  ],
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
})
export class BlogCommentModule {}
