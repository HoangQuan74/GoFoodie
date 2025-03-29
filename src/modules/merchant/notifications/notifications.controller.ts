import { Controller, Get, Patch, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { EStoreNotificationType } from 'src/common/enums';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async find(@Query() query: QueryNotificationDto, @CurrentStore() storeId: number) {
    const { limit, page, type, isRead } = query;

    const queryBuilder = this.notificationsService
      .createQueryBuilder('notification')
      .where('notification.storeId = :storeId', { storeId })
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('notification.id', 'DESC');

    type && type.length && queryBuilder.andWhere('notification.type IN (:...type)', { type });
    const unread = await queryBuilder.clone().andWhere('notification.readAt IS NULL').getCount();

    if (typeof isRead === 'boolean') {
      queryBuilder.andWhere('notification.readAt IS ' + (isRead ? 'NOT NULL' : 'NULL'));
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total, unread };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @CurrentStore() storeId: number) {
    const notification = await this.notificationsService.findOne({ where: { id, storeId } });
    if (!notification) throw new NotFoundException();

    return this.notificationsService.update({ id, storeId }, { readAt: new Date() });
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentStore() storeId: number, @Query('type') type?: EStoreNotificationType) {
    const queryBuilder = this.notificationsService
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where('storeId = :storeId', { storeId })
      .andWhere('readAt IS NULL');

    type && queryBuilder.andWhere('type = :type', { type });
    queryBuilder.execute();
  }
}
