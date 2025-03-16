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
import { AdminService } from './admin.service';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminAuthPayloadDto,
  AdminRegistrationPayloadDto,
  AdminSelectFieldDto,
  AuthAdminDto,
  CreateAdminDto,
  FilterAndPaginationAdminDto,
  UpdateAdminDto,
} from './dto/admin.dto';
import {
  ConflictPayloadDto,
  ErrorPayloadDto,
  PayloadMultipleIdDto,
  PayloadObjectArrayDto,
  PayloadObjectDto,
} from '../../dto/api-response.dto';
import { ResponsePayload } from '../../interfaces/response-payload.interface';
import { AdminAuthResponse } from './interfaces/admin.interface';
import { ADMIN_AUTH_TOKEN_DEV } from '../../json/auth.db';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminMetaRoles } from './decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from './guards/admin-roles.guard';
import { AdminMetaPermissions } from './decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from './guards/admin-permission.guard';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ChangePasswordDto } from '../../dto/change-password.dto';

@Controller('admin')
@ApiTags('admin Api')
export class AdminController {
  private logger = new Logger(AdminController.name);

  constructor(private adminService: AdminService) {}

  /**
   * adminSignup()
   * adminLogin()
   * getLoggedInAdminData()
   * getAllAdmins()
   * getAdminById()
   * updateLoggedInAdminInfo()
   * changeLoggedInAdminPassword()
   * updateAdminById()
   * updateMultipleAdminById()
   * deleteAdminById()
   * deleteMultipleAdminById()
   */

  @Post('/signup')
  @ApiOperation({ description: 'Create new Admin' })
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiCreatedResponse({
    type: AdminRegistrationPayloadDto,
  })
  @ApiConflictResponse({
    type: ConflictPayloadDto,
  })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminAuthGuard)
  async adminSignup(
    @Body()
    createAdminDto: CreateAdminDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.adminSignup(createAdminDto);
  }

  @Post('/login')
  @ApiResponse({ type: AdminAuthPayloadDto, status: 201 })
  @ApiBadRequestResponse({
    type: ErrorPayloadDto,
  })
  @UsePipes(ValidationPipe)
  async adminLogin(
    @Body() authAdminDto: AuthAdminDto,
  ): Promise<AdminAuthResponse> {
    return await this.adminService.adminLogin(authAdminDto);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/logged-in-admin-data')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiQuery({
    name: 'select',
    required: false,
    example: 'name username phoneNo',
  })
  @ApiOkResponse({
    type: PayloadObjectDto,
  })
  @UseGuards(AdminAuthGuard)
  async getLoggedInAdminData(
    @Query(ValidationPipe) adminSelectFieldDto: AdminSelectFieldDto,
    @Req() req: any,
  ): Promise<ResponsePayload> {
    return this.adminService.getLoggedInAdminData(
      req.user,
      adminSelectFieldDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/all-admins')
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiOkResponse({
    type: PayloadObjectArrayDto,
  })
  @ApiQuery({
    name: 'q',
    required: false,
  })
  @ApiBody({ type: FilterAndPaginationAdminDto })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.GET)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async getAllAdmins(
    @Body() filterAdminDto: FilterAndPaginationAdminDto,
    @Query('q') searchString?: string,
  ): Promise<ResponsePayload> {
    return this.adminService.getAllAdmins(filterAdminDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @ApiQuery({
    name: 'select',
    required: false,
    example: 'name username phoneNo',
  })
  @ApiHeader({
    name: 'administrator',
    description: ADMIN_AUTH_TOKEN_DEV,
    required: true,
  })
  @ApiOkResponse({
    type: PayloadObjectDto,
  })
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.GET)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async getAdminById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query(ValidationPipe) adminSelectFieldDto: AdminSelectFieldDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.getAdminById(id, adminSelectFieldDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-logged-in-admin')
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
  @UseGuards(AdminPermissionGuard)
  async updateLoggedInAdminInfo(
    @Req() req: any,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.updateLoggedInAdminInfo(
      req.user,
      updateAdminDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/change-logged-in-admin-password')
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
  @UseGuards(AdminPermissionGuard)
  async changeLoggedInAdminPassword(
    @Req() res: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.changeLoggedInAdminPassword(
      res.user,
      changePasswordDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-admin/:id')
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
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async updateAdminById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.updateAdminById(id, updateAdminDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple-admin-by-id')
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
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async updateMultipleAdminById(
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<ResponsePayload> {
    return await this.adminService.updateMultipleAdminById(
      updateAdminDto.ids,
      updateAdminDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-admin/:id')
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
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async deleteAdminById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.adminService.deleteAdminById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple-admin-by-id')
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
  @AdminMetaRoles(AdminRoles.ADMIN, AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminAuthGuard)
  async deleteMultipleAdminById(
    @Body() data: { ids: string[] },
  ): Promise<ResponsePayload> {
    return await this.adminService.deleteMultipleAdminById(data.ids);
  }
}
