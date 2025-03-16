import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorCodes } from '../../enum/error-code.enum';
import { OptionPayloadDto } from '../../dto/api-response.dto';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { Blog } from './interfaces/blog.interface';
import {
  AddBlogDto,
  FilterAndPaginationBlogDto,
  UpdateBlogDto,
} from './dto/blog.dto';
import { UtilsService } from '../../shared/utils/utils.service';

import { NotificationService } from '../../shared/notification/notification.service';

const ObjectId = Types.ObjectId;

@Injectable()
export class BlogService {
  private logger = new Logger(BlogService.name);

  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,

    private readonly utilsService: UtilsService,
    private notificationService: NotificationService,
  ) {}

  /**
   * addBlog()
   * insertManyBlog()
   * getAllBlogs()
   * getAllBlogsBasic()
   * getBlogById()
   * updateBlogById()
   * updateMultipleBlogById()
   * deleteBlogById()
   * deleteMultipleBlogById()
   */
  async addBlog(addBlogDto: AddBlogDto): Promise<ResponsePayload> {
    try {
      const { slug, category, formType } = addBlogDto;
      let mData = addBlogDto;
      const fData = await this.blogModel.exists({ slug: slug });

      if (fData) {
        mData = {
          ...mData,
          ...{ slug: this.utilsService.transformToSlug(slug, true) },
        };
      }
      const newData = new this.blogModel(mData);

      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };

      return {
        success: true,
        message: 'Data Added Successfully',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async addBlogByVendor(
    vendor: any,
    addBlogDto: AddBlogDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug, category, formType } = addBlogDto;
      let mData = addBlogDto;
      // const fData = await this.blogModel.exists({ slug: slug });
      let fData;
      if (slug) {
        fData = await this.blogModel.exists({ slug: slug });
      }

      mData = {
        ...mData,
      };
      const newData = new this.blogModel(mData);

      // console.log('blogData', fData);

      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };

      // Admin
      if (saveData) {
        const description = `<strong>${'Reja'}</strong> added a new post: ${
          saveData.formType === 'blog'
            ? `${saveData.title}`
            : saveData.formType === 'Event'
            ? `${saveData.title}`
            : saveData.formType === 'Forum'
            ? `Forum`
            : ''
        }`;

        const url = `${
          saveData.formType === 'Blog'
            ? `/posts/edit-post/${saveData.id}`
            : saveData.formType === 'Event'
            ? `/posts/edit-post/${saveData.id}`
            : saveData.formType === 'Forum'
            ? `/posts/edit-post/${saveData.id}`
            : ''
        }`;
        //  notification
        this.notificationService.createNotification({
          name: 'Blog',
          description: description,
          url: url,
          isRead: false,
          type: 'Admin',
        });
      }

      return {
        success: true,
        message: 'Data Added Successfully',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async addBlogByUser(
    user: any,
    addBlogDto: AddBlogDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug, category, formType } = addBlogDto;
      let mData = addBlogDto;

      let fData;
      if (slug) {
        fData = await this.blogModel.exists({ slug: slug });
      }

      // console.log('vData', vData);

      if (fData) {
        mData = {
          ...mData,
          ...{ slug: this.utilsService.transformToSlug(slug, true) },
        };
      }

      mData = {
        ...mData,
      };
      const newData = new this.blogModel(mData);

      // console.log('blogData', fData);

      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };

      // Admin
      if (saveData) {
        const description = `<strong>${'Reja'}</strong> added a new post: ${
          saveData.formType === 'blog'
            ? `${saveData.title}`
            : saveData.formType === 'Event'
            ? `${saveData.title}`
            : saveData.formType === 'Forum'
            ? `Forum`
            : ''
        }`;

        const url = `${
          saveData.formType === 'Blog'
            ? `/posts/edit-post/${saveData.id}`
            : saveData.formType === 'Event'
            ? `/posts/edit-post/${saveData.id}`
            : saveData.formType === 'Forum'
            ? `/posts/edit-post/${saveData.id}`
            : ''
        }`;
        //  notification
        this.notificationService.createNotification({
          name: 'Blog',
          description: description,
          url: url,
          isRead: false,
          type: 'Admin',
        });
      }

      return {
        success: true,
        message: 'Data Added Successfully',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyBlog(
    addBlogsDto: AddBlogDto[],
    optionBlogDto: OptionPayloadDto,
  ): Promise<ResponsePayload> {
    try {
      const { deleteMany } = optionBlogDto;
      if (deleteMany) {
        await this.blogModel.deleteMany({});
      }
      const saveData = await this.blogModel.insertMany(addBlogsDto);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getAllBlogs(
    filterBlogDto: FilterAndPaginationBlogDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterBlogDto;
    const { pagination } = filterBlogDto;
    const { sort } = filterBlogDto;
    const { select } = filterBlogDto;

    // Essential Variables
    const aggregateSbloges = [];
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
      if (filter['category._id']) {
        filter['category._id'] = new ObjectId(filter['category._id']);
      }
      if (filter['subCategory._id']) {
        filter['subCategory._id'] = new ObjectId(filter['subCategory._id']);
      }
      mFilter = { ...mFilter, ...filter };
    }

    // if (vendor) {
    //   mFilter = { ...mFilter, ...{ 'vendor._id': new ObjectId(vendor?._id) } };
    // }

    if (searchQuery) {
      const mSearchQuery = searchQuery.replace(/[^a-zA-Z0-9 ]/g, '');

      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { name: { $regex: mSearchQuery, $options: 'i' } },
              { description: { $regex: mSearchQuery, $options: 'i' } },
              { title: { $regex: mSearchQuery, $options: 'i' } },
              {
                'contactDetails.country': {
                  $regex: mSearchQuery,
                  $options: 'i',
                },
              },
              {
                'contactDetails.state': { $regex: mSearchQuery, $options: 'i' },
              },
              {
                'contactDetails.city': { $regex: mSearchQuery, $options: 'i' },
              },
              {
                'contactDetails.postal': {
                  $regex: mSearchQuery,
                  $options: 'i',
                },
              },
            ],
          },
        ],
      };
      // mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
    }
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
      aggregateSbloges.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSbloges.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSbloges.push({ $project: mSelect });
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

      aggregateSbloges.push(mPagination);

      aggregateSbloges.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.blogModel.aggregate(aggregateSbloges);
      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Blogion mismatch');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getAllBlogsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;

      const data = await this.blogModel
        .find()
        .skip(pageSize * (currentPage - 1))
        .limit(Number(pageSize));
      return {
        success: true,
        message: 'Success',

        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getBlogById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.blogModel.findById(id).select(select);
      return {
        success: true,
        message: 'Single profile get Successfully',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateBlogById(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug, category, formType } = updateBlogDto;
      let mData = updateBlogDto;

      const fData = await this.blogModel.findById(id);
      const jData: Blog = JSON.parse(JSON.stringify(fData));

      if (slug && slug !== jData.slug) {
        const isExists = await this.blogModel.exists({ slug: slug });
        if (isExists) {
          mData = {
            ...mData,
            ...{ slug: this.utilsService.transformToSlug(slug, true) },
          };
        }
      }

      await this.blogModel.findByIdAndUpdate(id, {
        $set: mData,
      });

      // update Status Notification

      if (fData) {
        await this.updateStatusNotification(fData);
      }

      return {
        success: true,
        message: 'Update Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateBlogByVendor(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    try {
      const { slug, category, formType } = updateBlogDto;
      let mData = updateBlogDto;

      const fData = await this.blogModel.findById(id);
      const jData: Blog = JSON.parse(JSON.stringify(fData));

      if (slug && slug !== jData.slug) {
        const isExists = await this.blogModel.exists({ slug: slug });
        if (isExists) {
          mData = {
            ...mData,
            ...{ slug: this.utilsService.transformToSlug(slug, true) },
          };
        }
      }

      await this.blogModel.findByIdAndUpdate(id, {
        $set: mData,
      });

      // Update Vendor Status Notification

      if (fData) {
        const uData: any = await this.blogModel.findById(id);
        await this.updateVendorStatusNotification(uData);
      }

      if (formType === 'Event') {
        const uData: any = await this.blogModel.findById(id);
      }

      return {
        success: true,
        message: 'Update Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleBlogById(
    ids: string[],
    updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.blogModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateBlogDto },
      );

      // update Status Notification
      for (const mId of mIds) {
        const uData: any = await this.blogModel.findById(mId);

        if (uData) {
          await this.updateStatusNotification(uData);
        }
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteBlogById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      await this.blogModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Delete Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleBlogById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));

      for (const id of ids) {
        await this.createMultipleDeleteNotification(id);
      }

      await this.blogModel.deleteMany({ _id: ids });

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  private async updateStatusNotification(fData: any) {
    if (fData && fData.formType !== 'News') {
      const updateData: any = await this.blogModel.findById(fData._id);

      const description = `Your post '${
        fData.formType === 'Blog'
          ? `${fData.title}`
          : fData.formType === 'Event'
          ? `${fData.title}`
          : fData.formType === 'Forum'
          ? `'Forum'`
          : ''
      }' has been ${updateData.status === 'publish' ? 'approved' : 'denied'}.`;

      const url = ``;
      //  notification
      this.notificationService.createNotification({
        name: 'Edit blog',
        description: description,
        url: url,
        isRead: false,
      });
    }
  }

  private async updateVendorStatusNotification(fData: any) {
    const description = `<strong>${
      fData?.vendor?.name || 'Unknown'
    }</strong> edited the post: ${
      fData.formType === 'blog'
        ? `${fData.title}`
        : fData.formType === 'Event'
        ? `${fData.title}`
        : fData.formType === 'Forum'
        ? 'Forum'
        : ''
    }`;

    const url = `${
      fData.formType === 'Blog'
        ? `/posts/edit-post/${fData._id}`
        : fData.formType === 'Event'
        ? `/posts/edit-post/${fData._id}`
        : fData.formType === 'Forum'
        ? `/posts/edit-post/${fData._id}`
        : ''
    }`;
    //  notification
    this.notificationService.createNotification({
      name: 'Edit by vendor',
      description: description,
      url: url,
      isRead: false,
      type: 'Admin',
      // vendor: vData ?? uData,
      user: fData?.vendor,
    });
  }

  private async createMultipleDeleteNotification(id: string) {
    const fData: any = await this.blogModel.findById(id);

    // user / vendor
    if (fData && fData?.formType !== 'News') {
      const description = `Your post '${
        fData.formType === 'Blog'
          ? `${fData.title}`
          : fData.formType === 'Event'
          ? `${fData.title}`
          : fData.formType === 'Forum'
          ? `Forum`
          : ''
      }' has been removed.`;

      // const url = `${
      //   fData.formType === 'Buy & Sell'
      //     ? `buy-and-sell/edit-new/${fData._id}`
      //     : fData.formType === 'Deshi Service'
      //     ? `/deshi-service/edit-new/${fData._id}`
      //     : fData.formType === 'Rental'
      //     ? `/rental/edit-new/${fData._id}`
      //     : fData.formType === 'Job'
      //     ? `/job/edit-new/${fData._id}`
      //     : ''
      // }`;

      //  notification
      this.notificationService.createNotification({
        name: 'Delete blog',
        description: description,
        url: '',
        isRead: false,
        // user: fData?.vendor ,
      });
    }
  }
}
