import { Controller, Get, Patch, Param, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryNotificationDto } from './dto/query-notification.dto';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async find(@Query() query: QueryNotificationDto, @CurrentUser() user: JwtPayload) {
    const { limit, page, type, isRead } = query;

    const queryBuilder = this.notificationsService
      .createQueryBuilder('notification')
      .where('notification.clientId = :clientId', { clientId: user.id })
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('notification.id', 'DESC');

    type && queryBuilder.andWhere('notification.type = :type', { type });
    const unread = await queryBuilder.clone().andWhere('notification.readAt IS NULL').getCount();

    if (typeof isRead === 'boolean') {
      queryBuilder.andWhere('notification.readAt IS ' + (isRead ? 'NOT NULL' : 'NULL'));
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    const grouped = _.groupBy(items, (item) => moment(item.createdAt).format('YYYY-MM-DD'));
    const itemsGrouped = Object.keys(grouped).map((key) => ({ date: key, items: grouped[key] }));

    return { items: itemsGrouped, total, unread };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const notification = await this.notificationsService.findOne({ where: { id, clientId: user.id } });
    if (!notification) throw new NotFoundException();

    notification.readAt = new Date();
    return this.notificationsService.save(notification);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: JwtPayload, @Query('type') type?: string) {
    const queryBuilder = this.notificationsService
      .createQueryBuilder()
      .update()
      .set({ readAt: new Date() })
      .where('clientId = :clientId', { clientId: user.id })
      .andWhere('readAt IS NULL');

    type && queryBuilder.andWhere('type = :type', { type });
    queryBuilder.execute();
  }
}
