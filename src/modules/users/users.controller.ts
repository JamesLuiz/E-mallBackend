import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Post,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FollowUserDto } from './dto/follow-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('_id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(
    @CurrentUser('_id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload user avatar' })
  async uploadAvatar(
    @CurrentUser('_id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }

  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @CurrentUser('_id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // Follow system endpoints
  @Post('follow')
  @ApiOperation({ summary: 'Follow a user' })
  async followUser(
    @CurrentUser('_id') userId: string,
    @Body() followDto: FollowUserDto
  ) {
    return this.usersService.followUser(userId, followDto);
  }

  @Delete('follow/:followingId')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollowUser(
    @CurrentUser('_id') userId: string,
    @Param('followingId') followingId: string
  ) {
    return this.usersService.unfollowUser(userId, followingId);
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Get user followers' })
  async getFollowers(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.usersService.getFollowers(userId, page, limit);
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Get users that a user is following' })
  async getFollowing(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.usersService.getFollowing(userId, page, limit);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get follow suggestions for current user' })
  async getFollowSuggestions(
    @CurrentUser('_id') userId: string,
    @Query('limit') limit: number = 10
  ) {
    return this.usersService.getFollowSuggestions(userId, limit);
  }

  @Get('is-following/:userId')
  @ApiOperation({ summary: 'Check if current user is following another user' })
  async isFollowing(
    @CurrentUser('_id') followerId: string,
    @Param('userId') followingId: string
  ) {
    const isFollowing = await this.usersService.isFollowing(followerId, followingId);
    return { isFollowing };
  }
}