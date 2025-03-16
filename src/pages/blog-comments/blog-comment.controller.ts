/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Version,
    VERSION_NEUTRAL,
} from '@nestjs/common';

import {AdminRoles} from '../../enum/admin-roles.enum';

import {AdminPermissions} from '../../enum/admin-permission.enum';

import {MongoIdValidationPipe} from '../../pipes/mongo-id-validation.pipe';
import {BlogCommentService} from './blog-comment.service';
import {AddBlogCommentDto, FilterAndPaginationBlogCommentDto, UpdateBlogCommentDto} from './dto/blog-comment.dto';
import {ResponsePayload} from '../../interfaces/response-payload.interface';
import {ApiBearerAuth, ApiCreatedResponse, ApiHeader} from '@nestjs/swagger';
import {ADMIN_AUTH_TOKEN_DEV} from '../../json/auth.db';
import {PayloadObjectDto} from '../../dto/api-response.dto';
import {AdminMetaRoles} from '../admin/decorator/admin-roles.decorator';
import {AdminAuthGuard} from '../admin/guards/admin-auth.guard';
import {AdminMetaPermissions} from '../admin/decorator/admin-permissions.decorator';
import {AdminPermissionGuard} from '../admin/guards/admin-permission.guard';
import {AdminRolesGuard} from '../admin/guards/admin-roles.guard';


@Controller('blog-comment')
export class BlogCommentController {
    private logger = new Logger(BlogCommentController.name);

    constructor(private blogCommentService: BlogCommentService) {
    }

    /**
     * addBlogComment
     * insertManyBlogComment
     */
    @Post('/add')
    @ApiHeader({
        name: 'administrator',
        description: ADMIN_AUTH_TOKEN_DEV,
        required: true,
    })
    @ApiBearerAuth()
    @ApiCreatedResponse({type: PayloadObjectDto})
    @UsePipes(ValidationPipe)
    
    async addBlogComment(
        @Req() req: any,
        @Body()
            addBlogCommentDto: AddBlogCommentDto,
    ): Promise<ResponsePayload> {
        return await this.blogCommentService.addBlogComment(req.user, addBlogCommentDto);
    }


    @Post('/add-vendor')
    @ApiHeader({
        name: 'administrator',
        description: ADMIN_AUTH_TOKEN_DEV,
        required: true,
    })
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: PayloadObjectDto })
    @UsePipes(ValidationPipe)
    
    async addCommentByVendor(
      @Req() req: any,
      @Body()
      addForumCommentDto: any,
    ): Promise<ResponsePayload> {
        return await this.blogCommentService.addCommentByVendor(

          addForumCommentDto,
        );
    }





    @Put('update-all-reply/:id')
    async updateAllReplies(
      @Param('id') id: string,
      @Body() updateData: { type: string; text: string; replyId?: string; nestedReplyId?: string },
    ) {
        return this.blogCommentService.updateAllReplies(id, updateData);
    }

    @Version(VERSION_NEUTRAL)
    @Put('/update-reply1')
    // @UsePipes(ValidationPipe)
    
    async reply1BlogCommentById(
      @Body() updateBlogCommentDto: UpdateBlogCommentDto,
      @Req() req: any,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.reply1BlogCommentById(updateBlogCommentDto,req.user);
    }

    @Version(VERSION_NEUTRAL)
    @Put('/update-reply2')
    // @UsePipes(ValidationPipe)
    
    async reply2BlogCommentById(
      @Body() updateBlogCommentDto: UpdateBlogCommentDto,
      @Req() req: any,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.reply2BlogCommentById(updateBlogCommentDto,req.user);
    }

    @Version(VERSION_NEUTRAL)
    @Put('/update-reply1-vendor')
    // @UsePipes(ValidationPipe)
    
    async reply1FormCommentById(
      @Body() updateBlogCommentDto: UpdateBlogCommentDto,
      @Req() req: any,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.reply1BlogCommentById(updateBlogCommentDto,req.user);
    }

    @Version(VERSION_NEUTRAL)
    @Put('/update-reply2-vendor')
    // @UsePipes(ValidationPipe)
    
    async reply2FormCommentById(
      @Body() updateBlogCommentDto: UpdateBlogCommentDto,
      @Req() req: any,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.reply2BlogCommentById(updateBlogCommentDto,req.user);
    }

    @Post('/add-by-admin')
    @ApiCreatedResponse({type: PayloadObjectDto})
    // @UsePipes(ValidationPipe)
    // 
    async addBlogCommentByAdmin(
        @Body()
            addBlogCommentDto: AddBlogCommentDto,
    ): Promise<ResponsePayload> {
        return await this.blogCommentService.addBlogCommentByAdmin(addBlogCommentDto);
    }

    /**
     * getAllBlogComments
     * getBlogCommentById
     */

    @Version(VERSION_NEUTRAL)
    @Get('/get-all-blogComment')
    @UsePipes(ValidationPipe)
    async getAllBlogComments(): Promise<ResponsePayload> {
        return this.blogCommentService.getAllBlogComments();
    }

    @Version(VERSION_NEUTRAL)
    @Post('/get-all-blogComment-by-query')
    @UsePipes(ValidationPipe)
    async getAllBlogCommentsByQuery(
        @Body() filterBlogCommentDto: FilterAndPaginationBlogCommentDto,
        @Query('q') searchString: string,
    ): Promise<ResponsePayload> {
        return this.blogCommentService.getAllBlogCommentsByQuery(
            filterBlogCommentDto,
            searchString,
        );
    }

    /**
     * getCartByUserId()
     */


    @Version(VERSION_NEUTRAL)
    @Get('/get-blog-comment-by-vendor')
    @UsePipes(ValidationPipe)
    
    async getCartByVendorId(@Req() req: any,): Promise<ResponsePayload> {
        // console.log(user);
        return this.blogCommentService.getBlogCommentByVendorId(req.user);
    }

    @Version(VERSION_NEUTRAL)
    @Get('/:id')
    async getBlogCommentById(
        @Param('id', MongoIdValidationPipe) id: string,
        @Query() select: string,
    ): Promise<ResponsePayload> {
        return await this.blogCommentService.getBlogCommentById(id, select);
    }

    /**
     * updateBlogCommentById
     * updateMultipleBlogCommentById
     */
    @Version(VERSION_NEUTRAL)
    @Put('/update')
    @UsePipes(ValidationPipe)
    // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
    // @UseGuards(AdminRolesGuard)
    // @AdminMetaPermissions(AdminPermissions.EDIT)
    // @UseGuards(AdminPermissionGuard)
    // @UseGuards(AdminAuthGuard)
    async updateBlogCommentById(
        @Body() updateBlogCommentDto: UpdateBlogCommentDto,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.updateBlogCommentById(updateBlogCommentDto);
    }

    @Version(VERSION_NEUTRAL)
    @Put('/update-and-blogComment-remove')
    @UsePipes(ValidationPipe)
    @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
    @UseGuards(AdminRolesGuard)
    @AdminMetaPermissions(AdminPermissions.EDIT)
    @UseGuards(AdminPermissionGuard)
    @UseGuards(AdminAuthGuard)
    async updateBlogCommentByIdAndDelete(
        @Body() updateBlogCommentDto: UpdateBlogCommentDto,
    ): Promise<ResponsePayload> {
        // console.log('updateBlogCommentDto', updateBlogCommentDto);
        return await this.blogCommentService.updateBlogCommentByIdAndDelete(updateBlogCommentDto);
    }

    /**
     * deleteBlogCommentById
     * deleteMultipleBlogCommentById
     */
    @Version(VERSION_NEUTRAL)
    @Delete('/delete/:id')
    @UsePipes(ValidationPipe)
    // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
    // @UseGuards(AdminRolesGuard)
    // @AdminMetaPermissions(AdminPermissions.DELETE)
    // @UseGuards(AdminPermissionGuard)
    // @UseGuards(AdminAuthGuard)
    async deleteBlogCommentById(
        @Param('id', MongoIdValidationPipe) id: string,
    ): Promise<ResponsePayload> {
        return await this.blogCommentService.deleteBlogCommentById(id);
    }





    @Delete('delete-comment-by-id/:id')
    async delete(
      @Param('id') id: string,
      @Query('replyId') replyId?: string,
      @Query('nestedReplyId') nestedReplyId?: string
    ) {
        return this.blogCommentService.deleteCommentOrReply(id, replyId, nestedReplyId);
    }


}
