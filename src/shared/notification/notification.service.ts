import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../utils/utils.service';
import { Notification } from './interfaces/notification.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import {
  FilterAndPaginationNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

import { ResponsePayload } from '../../interfaces/response-payload.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,

    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}



  async createNotification(data: any) {
    try {
      const saveData = new this.notificationModel(data);
      await saveData.save();
      return {
        success: true,
        message: 'Success',
        data: null,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllNotifications(
    filterNotificationDto: FilterAndPaginationNotificationDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterNotificationDto;
    const { pagination } = filterNotificationDto;
    const { sort } = filterNotificationDto;
    const { select } = filterNotificationDto;

    // Essential Variables
    const aggregateSnotificationes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }

    // Add isRead filter to count unread notifications
    const unreadFilter = { ...mFilter, isRead: false };

    // Count unread notifications
    const unreadCount = await this.notificationModel.countDocuments(
      unreadFilter,
    );

    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = {
        name: 1,
      };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSnotificationes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSnotificationes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSnotificationes.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateSnotificationes.push(mPagination);

      aggregateSnotificationes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.notificationModel.aggregate(
        aggregateSnotificationes,
      );
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          unreadCount, // Return unread count
          success: true,
          message: 'Success',
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          unreadCount, // Return unread count
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getAllNotificationsByVendor(
    filterNotificationDto: any,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterNotificationDto;
    const { pagination } = filterNotificationDto;
    const { sort } = filterNotificationDto;
    const { select } = filterNotificationDto;

    // Essential Variables
    const aggregateSnotificationes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['vendor._id']) {
        filter['vendor._id'] = new ObjectId(filter['vendor._id']);
      }
      if (filter['user._id']) {
        filter['user._id'] = new ObjectId(filter['user._id']);
      }
      mFilter = { ...mFilter, ...filter };
    }

    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }

    // Add isRead filter to count unread notifications
    const unreadFilter = { ...mFilter, isRead: false };

    // Count unread notifications
    const unreadCount = await this.notificationModel.countDocuments(
      unreadFilter,
    );

    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = {
        name: 1,
      };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSnotificationes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSnotificationes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSnotificationes.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateSnotificationes.push(mPagination);

      aggregateSnotificationes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.notificationModel.aggregate(
        aggregateSnotificationes,
      );
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          unreadCount, // Return unread count
          success: true,
          message: 'Success',
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          unreadCount,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getAllNotificationsByUser(
    filterNotificationDto: any,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterNotificationDto;
    const { pagination } = filterNotificationDto;
    const { sort } = filterNotificationDto;
    const { select } = filterNotificationDto;

    // Essential Variables
    const aggregateSnotificationes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      if (filter['user._id']) {
        filter['user._id'] = new ObjectId(filter['user._id']);
      }
      if (filter['vendor._id']) {
        filter['vendor._id'] = new ObjectId(filter['vendor._id']);
      }
      mFilter = { ...mFilter, ...filter };
    }

    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }

    // Add isRead filter to count unread notifications
    const unreadFilter = { ...mFilter, isRead: false };

    // Count unread notifications
    const unreadCount = await this.notificationModel.countDocuments(
      unreadFilter,
    );

    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = {
        name: 1,
      };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSnotificationes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSnotificationes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSnotificationes.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateSnotificationes.push(mPagination);

      aggregateSnotificationes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.notificationModel.aggregate(
        aggregateSnotificationes,
      );
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          unreadCount, // Return unread count
          success: true,
          message: 'Success',
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
          unreadCount,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * updateNotificationById
   * updateMultipleNotificationById
   */
  async updateNotificationById(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<ResponsePayload> {
    try {
      const finalData = { ...updateNotificationDto };
      await this.notificationModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Update Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteUserNotificationById
   * deleteMultipleUserNotificationById
   */
  async deleteUserNotificationById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      await this.notificationModel.findByIdAndDelete(id);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
