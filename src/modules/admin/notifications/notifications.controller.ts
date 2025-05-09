import { Controller, Get, UseGuards, Query, Post, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { IAdmin } from 'src/common/interfaces';
import { FindNotificationsDto } from './dto/find-notifications.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async find(@Query() query: FindNotificationsDto) {
    const { page, limit, isRead, userType, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.notificationsService
      .createQueryBuilder('notification')
      .orderBy('notification.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    typeof isRead === 'boolean' && queryBuilder.andWhere('notification.isRead = :isRead', { isRead });
    userType && queryBuilder.andWhere('notification.userType = :userType', { userType });
    createdAtFrom && queryBuilder.andWhere('notification.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('notification.createdAt <= :createdAtTo', { createdAtTo });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get('unread-count')
  async getUnreadCount() {
    return this.notificationsService
      .createQueryBuilder('notification')
      .where('notification.isRead = :isRead', { isRead: false })
      .getCount();
  }

  @Get('read-all')
  async readAll() {
    return this.notificationsService.createQueryBuilder().update().set({ isRead: true }).execute();
  }

  @Post(':id/unread')
  async unread(@CurrentUser() user: IAdmin, @Param('id') id: number) {
    this.notificationsService.createQueryBuilder().update().set({ isRead: false }).where('id = :id', { id }).execute();
  }

  @Post(':id/read')
  async read(@CurrentUser() user: IAdmin, @Param('id') id: number) {
    this.notificationsService.createQueryBuilder().update().set({ isRead: true }).where('id = :id', { id }).execute();
  }
}
