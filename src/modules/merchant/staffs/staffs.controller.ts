import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { EStaffRole } from 'src/common/enums';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { InviteStaffDto } from './dto/invite-staff.dto';

@Controller('staffs')
@UseGuards(AuthGuard)
@ApiTags('Quản lý nhân viên')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Get('roles')
  @ApiOperation({ summary: 'Danh sách vai trò' })
  async getRoles() {
    return this.staffsService.getRoles();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  async getStaffs(@CurrentUser() staff: JwtPayload, @CurrentStore() storeId: number) {
    return this.staffsService.getStaffs(storeId);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Danh sách quyền của tài khoản đang đăng nhập' })
  async getPermissions(@CurrentUser() staff: JwtPayload, @CurrentStore() storeId: number) {
    return this.staffsService.getPermissions(staff.id, storeId);
  }

  @Get('operations')
  @ApiOperation({ summary: 'Danh sách quyền' })
  async getOperations(@Query('roleCode') roleCode: EStaffRole) {
    return this.staffsService.getOperations(roleCode);
  }

  @Get('invitations')
  @ApiOperation({ summary: 'Danh sách lời mời' })
  async getInvitations(@CurrentUser() staff: JwtPayload) {
    return this.staffsService.getInvitations(staff.id);
  }

  @Post('invitations')
  @ApiOperation({ summary: 'Mời nhân viên' })
  async inviteStaff(@CurrentUser() staff: JwtPayload, @CurrentStore() storeId: number, @Body() body: InviteStaffDto) {
    return this.staffsService.inviteStaff(storeId, body);
  }

  @Post('accept-invitation')
  @ApiOperation({ summary: 'Chấp nhận lời mời' })
  async acceptInvitation(@CurrentUser() staff: JwtPayload, @Body('storeId') storeId: number) {
    // return this.staffsService.acceptInvitation(staff.id, storeId);
  }

  @Post('reject-invitation')
  @ApiOperation({ summary: 'Từ chối lời mời' })
  async rejectInvitation(@CurrentUser() staff: JwtPayload, @Body('storeId') storeId: number) {
    // return this.staffsService.rejectInvitation(staff.id, storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  async getStaffDetail(@CurrentUser() staff: JwtPayload, @CurrentStore() storeId: number) {
    return this.staffsService.getStaffDetail(staff.id, storeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhân viên' })
  async deleteStaff(@CurrentUser() staff: JwtPayload, @CurrentStore() storeId: number) {
    return this.staffsService.deleteStaff(staff.id, storeId);
  }
}
