import {
  Body,
  Controller, Delete,
  Logger,
  Param,
  Post,
  Put,
  Query, Req, UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  FilterAndPaginationNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { NotificationService } from './notification.service';
import { ResponsePayload } from '../../interfaces/response-payload.interface';




@Controller('notification')
export class NotificationController {
  private logger = new Logger(NotificationController.name);

  constructor(private notificationService: NotificationService) {}

  /**
   * getAllNotifications
   * getNotificationById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllNotifications(
    @Body() filterNotificationDto: FilterAndPaginationNotificationDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.notificationService.getAllNotifications(
      filterNotificationDto,
      searchString,
    );
  }


  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-vendor')
  @UsePipes(ValidationPipe)
  
  async getAllNotificationsByVendor(
    @Body() filterNotificationDto: FilterAndPaginationNotificationDto,
    @Query('q') searchString: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {

    // filterNotificationDto.filter = {
    //   ...filterNotificationDto.filter,
    //   ...{ 'vendor._id': req.user._id },
    // };
    return this.notificationService.getAllNotificationsByVendor(
      filterNotificationDto,
      searchString,
    );
  }


  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-user')
  @UsePipes(ValidationPipe)

  async getAllNotificationsByUser(
    @Body() filterNotificationDto: FilterAndPaginationNotificationDto,
    @Query('q') searchString: string,
    @Req() req: any,
  ): Promise<ResponsePayload> {

    // filterNotificationDto.filter = {
    //   ...filterNotificationDto.filter,
    //   ...{ 'user._id': req.user._id },
    // };
    return this.notificationService.getAllNotificationsByUser(
      filterNotificationDto,
      searchString,
    );
  }

  /**
   * updateNotificationById
   * updateMultipleNotificationById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateNotificationById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<ResponsePayload> {
    return await this.notificationService.updateNotificationById(
      id,
      updateNotificationDto,
    );
  }



  /**
   * deleteNotificationById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')

  async deleteUserNotificationById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.notificationService.deleteUserNotificationById(
      id,
      Boolean(checkUsage),
    );
  }


}
