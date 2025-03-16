import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { ErrorCodes } from '../../enum/error-code.enum';

import { Blog } from '../blog/interfaces/blog.interface';
import {
  AddBlogCommentDto,
  FilterAndPaginationBlogCommentDto,
  UpdateBlogCommentDto,
} from './dto/blog-comment.dto';
import { ResponsePayload } from '../../interfaces/response-payload.interface';

import { NotificationService } from '../../shared/notification/notification.service';
import { BlogComment } from './interfaces/blog-comment.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class BlogCommentService {
  private logger = new Logger(BlogCommentService.name);

  constructor(
    @InjectModel('BlogComment')
    private readonly blogCommentModel: Model<BlogComment>,

    // @InjectModel('Product') private readonly blogModel: Model<Product>,
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,

    private notificationService: NotificationService,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addBlogComment
   * insertManyBlogComment
   */
  async addBlogComment(
    user: any,
    addBlogCommentDto: AddBlogCommentDto,
  ): Promise<ResponsePayload> {
    try {
      const blogData = await this.blogModel
        .findById({ _id: addBlogCommentDto.blog })
        .select('title slug images formType vendor');


      const mData = {
        ...addBlogCommentDto,
        ...{
          blog: {
            _id: blogData._id,
            title: blogData.title,
            images: blogData.images,
            formType: blogData.formType,
            slug: blogData.slug,
          },

          vendor: blogData.vendor,
        },
      };
      const newData = new this.blogCommentModel(mData);
      const saveData: any = await newData.save();

      // total comment count
      const commentData = await this.blogCommentModel.countDocuments({
        'blog._id': blogData?._id,
      });

      await this.blogModel.findByIdAndUpdate(
        { _id: blogData?._id },
        {
          $set: { blogComments: commentData },
        },
        { upsert: true, new: true },
      );

      // Create Notification
      await this.createNotification(saveData);

      return {
        success: true,
        message: 'blogComment Added Successfully!',
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addCommentByVendor(

    addForumCommentDto: any,
  ): Promise<ResponsePayload> {
    try {
      const blogData = await this.blogModel
        .findById({ _id: addForumCommentDto.blog })
        .select('title slug images formType vendor');


      const mData = {
        ...addForumCommentDto,
        ...{
          blog: {
            _id: blogData._id,
            title: blogData.title,
            images: blogData.images,
            formType: blogData.formType,
            slug: blogData.slug,
          },
          vendor: blogData.vendor,
        },
      };
      const newData = new this.blogCommentModel(mData);
      await newData.save();

      // total comment count
      const commentData = await this.blogCommentModel.countDocuments({
        'blog._id': blogData?._id,
      });

      await this.blogModel.findByIdAndUpdate(
        { _id: blogData?._id },
        {
          $set: { blogComments: commentData },
        },
        { upsert: true, new: true },
      );

      return {
        success: true,
        message: 'forumComment Added Successfully!',
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addBlogCommentByAdmin(
    addBlogCommentDto: AddBlogCommentDto,
  ): Promise<ResponsePayload> {
    try {
      const blogData = await this.blogModel
        .findById({ _id: addBlogCommentDto.blog })
        .select('name slug image');

      const mData = {
        ...addBlogCommentDto,
        ...{
          blog: {
            _id: blogData._id,
            name: blogData.name,
            image: blogData.image,
            slug: blogData.slug,
          },
          user: {
            _id: null,
            name: addBlogCommentDto.name,
            profileImg: null,
          },
        },
      };
      const newData = new this.blogCommentModel(mData);
      await newData.save();

      await this.blogModel.findByIdAndUpdate(addBlogCommentDto.blog, {
        $inc: {
          ratingCount: addBlogCommentDto.rating,
          ratingTotal: 1,
          blogCommentTotal: 1,
        },
      });

      switch (addBlogCommentDto.rating) {
        case 1: {
          await this.blogModel.findByIdAndUpdate(
            addBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.oneStar': 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 2: {
          await this.blogModel.findByIdAndUpdate(
            addBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.twoStar': 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 3: {
          await this.blogModel.findByIdAndUpdate(
            addBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.threeStar': 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 4: {
          await this.blogModel.findByIdAndUpdate(
            addBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.fourStar': 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 5: {
          await this.blogModel.findByIdAndUpdate(
            addBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.fiveStar': 1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        default: {
          //statements;
          break;
        }
      }

      return {
        success: true,
        message: 'blogComment Added Successfully!',
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async reply1BlogCommentById(
    updateBlogCommentDto: UpdateBlogCommentDto,
    user,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.blogCommentModel.findById(
        updateBlogCommentDto.commentId,
      );

      if (!data) {
        return {
          success: false,
          message: 'Comment not found',
        } as ResponsePayload;
      }





      const newReply = {

        replyDate: updateBlogCommentDto.replyDate,
        replyText: updateBlogCommentDto.replyText,
        replies: [],
      };

      if (data.reply && data.reply.length) {
        await this.blogCommentModel.findByIdAndUpdate(
          updateBlogCommentDto.commentId,
          {
            $push: {
              reply: newReply,
            },
          },
        );
      } else {
        await this.blogCommentModel.findByIdAndUpdate(
          updateBlogCommentDto.commentId,
          {
            $set: {
              reply: [newReply],
            },
          },
        );
      }

      // create Replay Notification
      await this.createReplayNotification(data);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.error('update error:', err);
      throw new InternalServerErrorException();
    }
  }

  async reply2BlogCommentById(
    updateBlogCommentDto: UpdateBlogCommentDto,
    user,
  ): Promise<ResponsePayload> {
    try {
      const data: any = await this.blogCommentModel.findById(
        updateBlogCommentDto.commentId,
      );
      if (!data) {
        return {
          success: false,
          message: 'Comment not found',
        } as ResponsePayload;
      }



      const replyData = data.reply.find(
        (f) => f._id.toString() === updateBlogCommentDto.parentReplyId,
      );

      const newReply = {

        replyDate: updateBlogCommentDto.replyDate,
        replyText: updateBlogCommentDto.replyText,
        replies: [],
      };

      if (replyData.replies && replyData.replies.length) {
        await this.blogCommentModel.updateOne(
          {
            _id: new ObjectId(updateBlogCommentDto.commentId),
            'reply._id': new ObjectId(updateBlogCommentDto.parentReplyId),
          },
          {
            $push: {
              'reply.$[e1].replies': newReply,
            },
          },
          {
            arrayFilters: [
              { 'e1._id': new ObjectId(updateBlogCommentDto.parentReplyId) },
            ],
          },
        );
      } else {
        await this.blogCommentModel.updateOne(
          {
            _id: new ObjectId(updateBlogCommentDto.commentId),
            'reply._id': new ObjectId(updateBlogCommentDto.parentReplyId),
          },
          {
            $set: {
              'reply.$[e1].replies': [newReply],
            },
          },
          {
            arrayFilters: [
              { 'e1._id': new ObjectId(updateBlogCommentDto.parentReplyId) },
            ],
          },
        );
      }

      // create Replay Notification
      await this.createReplayNotification(data);

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.error('update error:', err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * getAllBlogCommentsByQuery()
   * getAllBlogComments()
   * getBlogCommentById()
   */
  /**
   * getCartByanyId()
   */
  async getBlogCommentByanyId(user: any): Promise<ResponsePayload> {
    console.log(user);

    try {
      const data = await this.blogCommentModel
        .find({ 'user._id': user._id })
        .populate('user', 'name phoneNo profileImg username')
        .populate('blog', 'name slug image ')
        .sort({ createdAt: -1 });

      return {
        data: data,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getBlogCommentByVendorId(user: any): Promise<ResponsePayload> {
    try {
      const data = await this.blogCommentModel
        .find({ 'user._id': user._id })
        .populate('user', 'name vendorBasicInfo profileImg')
        .populate('blog', 'name slug image ')
        .sort({ createdAt: -1 });

      return {
        data: data,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllBlogCommentsByQuery(
    filterBlogCommentDto: FilterAndPaginationBlogCommentDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterBlogCommentDto;
    const { pagination } = filterBlogCommentDto;
    const { sort } = filterBlogCommentDto;
    const { select } = filterBlogCommentDto;
    const { filterGroup } = filterBlogCommentDto;

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match

    if (filter) {
      if (filter['blog._id']) {
        filter['blog._id'] = new ObjectId(filter['blog._id']);
      }
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { orderId: { $regex: searchQuery, $options: 'i' } },
              { phoneNo: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
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
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
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

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.blogCommentModel.aggregate(
        aggregateStages,
      );
      // .populate('user', 'fullName profileImg username')
      //     .populate('blog', 'blogName blogSlug images categorySlug')
      //     .sort({createdAt: -1})

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
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllBlogComments(): Promise<ResponsePayload> {
    try {
      const blogComments = await this.blogCommentModel
        .find()
        .populate('user', 'name phoneNo profileImg username')
        .populate('blog', 'name slug image ')
        .sort({ createdAt: -1 });
      return {
        success: true,
        message: 'Success',
        data: blogComments,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getBlogCommentById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.blogCommentModel.findById(id).select(select);

      // const blogCommentId = req.params.blogCommentId;
      // const blogComment = await BlogCommentControl.findOne({_id: blogCommentId});

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateBlogCommentById
   * updateMultipleBlogCommentById
   */
  async updateBlogCommentById(
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.blogCommentModel.findById(updateBlogCommentDto);
      // console.log('data++++', data);

      if (data.status === updateBlogCommentDto.status) {
        await this.blogCommentModel.updateOne(
          { _id: updateBlogCommentDto },
          { $set: updateBlogCommentDto },
        );
      } else {
        if (data.status === true && updateBlogCommentDto.status === false) {
          await this.blogCommentModel.updateOne(
            { _id: updateBlogCommentDto },
            { $set: updateBlogCommentDto },
          );

          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog._id,
            {
              $inc: {
                ratingCount: -updateBlogCommentDto.rating,
                ratingTotal: -1,
                blogCommentTotal: -1,
              },
            },
          );

          switch (updateBlogCommentDto.rating) {
            case 1: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.oneStar': -1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 2: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.twoStar': -1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 3: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.threeStar': -1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 4: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.fourStar': -1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 5: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.fiveStar': -1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            default: {
              //statements;
              break;
            }
          }
        } else {
          await this.blogCommentModel.updateOne(
            { _id: updateBlogCommentDto },
            { $set: updateBlogCommentDto },
          );

          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog._id,
            {
              $inc: {
                ratingCount: updateBlogCommentDto.rating,
                ratingTotal: 1,
                blogCommentTotal: 1,
              },
            },
          );

          switch (updateBlogCommentDto.rating) {
            case 1: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.oneStar': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 2: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.twoStar': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 3: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.threeStar': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 4: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.fourStar': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            case 5: {
              await this.blogModel.findByIdAndUpdate(
                updateBlogCommentDto.blog,
                {
                  $inc: {
                    'ratingDetails.fiveStar': 1,
                  },
                },
                {
                  upsert: true,
                  new: true,
                },
              );
              break;
            }
            default: {
              //statements;
              break;
            }
          }
        }
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      // console.log('update', err);
      throw new InternalServerErrorException();
    }
  }

  async updateBlogCommentByIdAndDelete(
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<ResponsePayload> {
    try {
      await this.blogCommentModel.updateOne(
        { _id: updateBlogCommentDto },
        { $set: updateBlogCommentDto },
      );

      await this.blogModel.findByIdAndUpdate(updateBlogCommentDto.blog._id, {
        $inc: {
          ratingCount: -updateBlogCommentDto.rating,
          ratingTotal: -1,
          blogCommentTotal: -1,
        },
      });

      switch (updateBlogCommentDto.rating) {
        case 1: {
          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.oneStar': -1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 2: {
          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.twoStar': -1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 3: {
          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.threeStar': -1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 4: {
          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.fourStar': -1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        case 5: {
          await this.blogModel.findByIdAndUpdate(
            updateBlogCommentDto.blog,
            {
              $inc: {
                'ratingDetails.fiveStar': -1,
              },
            },
            {
              upsert: true,
              new: true,
            },
          );
          break;
        }
        default: {
          //statements;
          break;
        }
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      // console.log('update', err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteBlogCommentById
   * deleteMultipleBlogCommentById
   */
  async deleteBlogCommentById(id: string): Promise<ResponsePayload> {
    try {
      await this.blogCommentModel.deleteOne({ _id: id });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteBlogCommentByLoggedinanyAndBlogCommentId(
    id: string,
    user: any,
  ): Promise<ResponsePayload> {
    try {
      await this.blogCommentModel.deleteOne({ _id: id, 'user._id': user._id });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateAllReplies(
    id: string,
    updateData: {
      type: string;
      text: string;
      replyId?: string;
      nestedReplyId?: string;
    },
  ) {
    const { type, text, replyId, nestedReplyId } = updateData;

    if (type === 'review') {
      return this.blogCommentModel.findByIdAndUpdate(
        id,
        { $set: { review: text } },
        { new: true },
      );
    } else if (type === 'reply') {
      return this.blogCommentModel.findOneAndUpdate(
        { _id: id, 'reply._id': replyId },
        { $set: { 'reply.$.replyText': text } },
        { new: true },
      );
    } else if (type === 'nestedReply') {
      console.log('nestedReply', updateData);
      return this.blogCommentModel.findOneAndUpdate(
        { _id: id, 'reply._id': replyId, 'reply.replies._id': nestedReplyId },
        { $set: { 'reply.$[outer].replies.$[inner].replyText': text } },
        {
          new: true,
          arrayFilters: [
            { 'outer._id': replyId },
            { 'inner._id': nestedReplyId },
          ],
        },
      );
    }
  }

  async deleteCommentOrReply(
    commentId: string,
    replyId?: string,
    nestedReplyId?: string,
  ): Promise<any> {
    if (!replyId && !nestedReplyId) {
      // total comment count

      const comment = JSON.parse(
        JSON.stringify(await this.blogCommentModel.findById(commentId)),
      );
      // const blogData = await this.blogModel
      //   .findById({ _id: comment.blog._id })
      //   .select('title slug images formType vendor');

      // Delete the main comment
      const response = await this.blogCommentModel
        .deleteOne({ _id: commentId })
        .exec();

      const commentData = await this.blogCommentModel.countDocuments({
        'blog._id': comment.blog._id,
      });

      console.log('commentData,commentData', commentData);

      await this.blogModel.findByIdAndUpdate(
        { _id: comment.blog._id },
        {
          $set: { blogComments: commentData },
        },
        { upsert: true, new: true },
      );
      // Delete the main comment
      return;
      // return this.forumCommentModel.deleteOne({ _id: commentId }).exec();
    }

    if (replyId && !nestedReplyId) {
      // Delete a reply
      return this.blogCommentModel
        .updateOne({ _id: commentId }, { $pull: { reply: { _id: replyId } } })
        .exec();
    }

    if (replyId && nestedReplyId) {
      // Delete a nested reply
      return this.blogCommentModel
        .updateOne(
          { _id: commentId, 'reply._id': replyId },
          { $pull: { 'reply.$.replies': { _id: nestedReplyId } } },
        )
        .exec();
    }

    throw new Error('Invalid parameters for deletion');
  }

  private async createNotification(saveData: any) {
    {
      if (
        saveData?.blog?.formType === 'Blog' ||
        saveData?.blog?.formType === 'News' ||
        saveData?.blog?.formType === 'Event'
      ) {
        const fData: any = await this.blogModel.findById(saveData.blog._id);

        if (fData) {
          const description = `<strong>${'Unknown'}</strong>  commented on your post  ${
            fData.title
          }
          `;

          const blogDataUrl = `${
            fData?.formType === 'Blog'
              ? `/blog/details/${fData?._id}`
              : fData?.formType === 'Event'
              ? `/events/details/${fData?._id}`
              : ''
          }`;

          // notification
          this.notificationService.createNotification({
            name: 'New comment on post',
            description: description,
            url: blogDataUrl,
            isRead: false,
          });
        }
      }
    }
  }
  private async createReplayNotification(saveData: any) {
    {
      if (
        saveData?.blog?.formType === 'Blog' ||
        saveData?.blog?.formType === 'News' ||
        saveData?.blog?.formType === 'Event'
      ) {
        const fData: any = await this.blogModel.findById(saveData.blog._id);

        if (fData) {
          if (saveData?.blog?.formType === 'News') {
            const description = `<strong>${'Unknown'}</strong> replied to your comment on  ${
              fData.formType === 'News' ? `${fData.title}` : ''
            }`;

            const url = `${
              fData.formType === 'News' ? `/posts/edit-post/${fData?._id}` : ''
            }`;
            //  notification
            this.notificationService.createNotification({
              name: 'Reply to your comment',
              description: description,
              url: url,
              isRead: false,
              type: 'Admin',
            });
          } else {
            const description = `<strong>${'Unknown'}</strong> replied to your comment on  ${
              fData.title
            }
          `;

            const blogDataUrl = `${
              fData?.formType === 'Blog'
                ? `/blog/details/${fData?._id}`
                : fData?.formType === 'Event'
                ? `/events/details/${fData?._id}`
                : ''
            }`;

            // notification
            this.notificationService.createNotification({
              name: 'Reply to your comment',
              description: description,
              url: blogDataUrl,
              isRead: false,
            });
          }
        }
      }
    }
  }
}
