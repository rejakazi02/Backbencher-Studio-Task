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
import { BlogService } from './blog.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ADMIN_AUTH_TOKEN_DEV, VENDOR_AUTH_TOKEN_DEV } from 'src/json/auth.db';
import {
  ErrorPayloadDto,
  PayloadMultipleIdDto,
  PayloadObjectArrayDto,
  PayloadObjectDto,
} from '../../dto/api-response.dto';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { AdminMetaRoles } from '../admin/decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../admin/guards/admin-roles.guard';
import { AdminMetaPermissions } from '../admin/decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../admin/guards/admin-permission.guard';
import {
  AddBlogDto,
  FilterAndPaginationBlogDto,
  InsertManyBlogDto,
  UpdateBlogDto,
} from './dto/blog.dto';
import { AdminAuthGuard } from '../admin/guards/admin-auth.guard';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('blog')
@ApiTags('blog Api')
export class BlogController {
  private logger = new Logger(BlogController.name);

  constructor(private blogService: BlogService) {}

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

  @Post('/add')
  @RateLimit({
    keyPrefix: 'addBlog', // Unique key for this endpoint
    points: 5, // Number of requests
    duration: 60, // Per 60 seconds (1 minute)
  })
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.EDITOR)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async addBlog(
    @Body()
    addBlogDto: AddBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.addBlog(addBlogDto);
  }

  @Post('/add-by-vendor')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async addBlogByVendor(
    @Req() req: any,
    @Body()
    addBlogDto: AddBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.addBlogByVendor(req.user, addBlogDto);
  }

  @Post('/add-by-user')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async addBlogByUser(
    @Req() req: any,
    @Body()
    addBlogDto: AddBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.addBlogByUser(req.user, addBlogDto);
  }

  @Post('/insert-many')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async insertManyBlog(
    @Body()
    body: InsertManyBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.insertManyBlog(body.data, body.option);
  }

  @Version(VERSION_NEUTRAL)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @ApiQuery({
    name: 'q',
    required: false,
  })
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllBlogs(
    @Body() filterBlogDto: FilterAndPaginationBlogDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.blogService.getAllBlogs(filterBlogDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-by-vendor')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @ApiQuery({
    name: 'q',
    required: false,
  })
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  async getAllBlogsByVendor(
    @Req() req: any,
    @Body() filterBlogDto: FilterAndPaginationBlogDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.blogService.getAllBlogs(filterBlogDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @Get('/get-all-basic')
  async getAllBlogsBasic(): Promise<ResponsePayload> {
    return await this.blogService.getAllBlogsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by/:id')
  @ApiQuery({
    name: 'select',
    required: false,
    example: 'name _id',
  })
  @ApiOkResponse({
    type: PayloadObjectDto,
  })
  async getBlogById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.blogService.getBlogById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiCreatedResponse({
    type: PayloadObjectDto,
  })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(
    AdminRoles.SUPER_ADMIN,
    AdminRoles.SUPER_ADMIN,
    AdminRoles.EDITOR,
  )
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async updateBlogById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.updateBlogById(id, updateBlogDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-by-vendor/:id')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async updateBlogByVendor(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.updateBlogByVendor(id, updateBlogDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-by-user/:id')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async updateBlogByUser(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.updateBlogByVendor(id, updateBlogDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiCreatedResponse({
    type: PayloadObjectDto,
  })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async updateMultipleBlogById(
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<ResponsePayload> {
    return await this.blogService.updateMultipleBlogById(
      updateBlogDto.ids,
      updateBlogDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiQuery({ name: 'checkUsage', required: false })
  @ApiCreatedResponse({
    type: PayloadObjectDto,
  })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(
    AdminRoles.SUPER_ADMIN,
    AdminRoles.SUPER_ADMIN,
    AdminRoles.EDITOR,
  )
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async deleteBlogById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.blogService.deleteBlogById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-by-vendor/:id')
  @ApiHeader({
    name: 'vendor',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async deleteBlogByVendor(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.blogService.deleteBlogById(id, Boolean(checkUsage));
  }

  @Delete('/delete-by-user/:id')
  @ApiHeader({
    name: 'user',
    description: VENDOR_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PayloadObjectDto })
  @UsePipes(ValidationPipe)
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @UsePipes(ValidationPipe)
  async deleteBlogByUser(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.blogService.deleteBlogById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: PayloadObjectDto,
  })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @ApiBody({ type: PayloadMultipleIdDto })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(
    AdminRoles.SUPER_ADMIN,
    AdminRoles.SUPER_ADMIN,
    AdminRoles.EDITOR,
  )
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async deleteMultipleBlogById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.blogService.deleteMultipleBlogById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
