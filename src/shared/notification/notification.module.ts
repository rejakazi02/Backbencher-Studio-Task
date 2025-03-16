import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './schema/notification.schema';

import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },

    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}
