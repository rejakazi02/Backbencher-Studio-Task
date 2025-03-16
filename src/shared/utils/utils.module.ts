import { Global, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { MongooseModule } from '@nestjs/mongoose';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([

    ]),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
