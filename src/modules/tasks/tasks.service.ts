import { MerchantEntity } from './../../database/entities/merchant.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EMerchantRole } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { ENoticeSendType } from 'src/common/enums/notice.enum';
import { FileEntity } from 'src/database/entities/file.entity';
import { NoticeEntity } from 'src/database/entities/notice.entity';
import { deleteFile } from 'src/utils/file';
import { Brackets, DataSource, LessThan, Repository } from 'typeorm';
import { MailHistoriesService } from '../mail-histories/mail-histories.service';
import { MailHistoryEntity } from 'src/database/entities/mail-history.entity';
import { EDriverApprovalStatus, EDriverStatus } from 'src/common/enums/driver.enum';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { CRONJOB } from 'src/common/constants';
import { OrderEntity } from 'src/database/entities/order.entity';
import { STORE_CONFIRM_TIME } from 'src/common/constants/common.constant';

@Injectable()
export class TasksService {
  private readonly chunkSize = 100;
  private readonly retryCount = 5;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,

    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,

    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    private readonly dataSource: DataSource,
    private readonly mailHistoriesService: MailHistoriesService,
    // private readonly orderService: OrderService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: !CRONJOB,
  })
  async cleanUpGarbageFiles() {
    const duration = 24 * 60 * 60 * 1000;
    const before = new Date(new Date().getTime() - duration);

    const count = await this.fileRepository.count({ where: { createdAt: LessThan(before) } });
    if (count === 0) return;

    const results = await this.fileRepository.query(
      `SELECT a.attrelid::regclass AS table_name, a.attname AS column_name
      FROM pg_attribute a
      JOIN pg_constraint c ON a.attrelid = c.conrelid
      AND a.attnum = ANY(c.conkey)
      WHERE c.confrelid = 'files'::regclass
      AND c.contype = 'f';`,
    );

    const pages = Math.ceil(count / this.chunkSize);

    for (let i = 0; i < pages; i++) {
      const files = await this.fileRepository.find({
        where: { createdAt: LessThan(before) },
        take: this.chunkSize,
        skip: i * this.chunkSize,
      });

      let fileIds = files.map((file) => file.id);

      for (const result of results) {
        const { table_name, column_name } = result;
        const fileIdsString = fileIds.map((id) => `'${id}'`).join(', ');

        const query = `SELECT ${column_name} FROM ${table_name} WHERE ${column_name} IN (${fileIdsString})`;
        const references = await this.dataSource.query(query);
        const referenceIds = references.map((reference) => reference[column_name]);
        fileIds = fileIds.filter((id) => !referenceIds.includes(id));

        if (fileIds.length === 0) break;
      }

      if (fileIds.length === 0) continue;

      for (const fileId of fileIds) {
        const file = files.find((file) => file.id === fileId);
        if (!file) continue;

        await this.fileRepository
          .delete(fileId)
          .then(() => {
            deleteFile(file.path);
          })
          .catch(() => {});
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: !CRONJOB,
  })
  async sendNotices() {
    const notices = await this.noticeRepository
      .createQueryBuilder('notice')
      .where('notice.isSent = false')
      .andWhere(
        new Brackets((qb) => {
          qb.where('notice.sendNow = true');
          qb.orWhere('notice.startTime <= :now', { now: new Date() });
        }),
      )
      .getMany();

    for (const notice of notices) {
      switch (notice.appType) {
        case EAppType.AppClient:
          // const clients = await this.dataSource.query('SELECT * FROM clients WHERE id IN (SELECT client_id FROM client_devices WHERE is_active = true)');
          // Send notice to user here
          // ...
          // ...
          break;
        case EAppType.AppMerchant:
          const merchantWhere = { role: EMerchantRole.Owner };
          const merchantCount = await this.merchantRepository.count({ where: merchantWhere });
          const merchantPages = Math.ceil(merchantCount / this.chunkSize);

          for (let i = 0; i < merchantPages; i++) {
            const merchants = await this.merchantRepository.find({
              select: ['id', 'name', 'email', 'deviceToken'],
              where: merchantWhere,
              take: this.chunkSize,
              skip: i * this.chunkSize,
            });

            for (const merchant of merchants) {
              if (notice.sendType === ENoticeSendType.Email && merchant.email) {
                const mailHistory = new MailHistoryEntity();
                mailHistory.to = merchant.email;
                mailHistory.subject = notice.title;
                mailHistory.body = notice.content;

                await this.mailHistoriesService.save(mailHistory);
              }
            }
          }

          break;
        case EAppType.AppDriver:
          const driverWhere = { status: EDriverStatus.Active, approvalStatus: EDriverApprovalStatus.Approved };
          const driverCount = await this.driverRepository.count({ where: driverWhere });
          const driverPages = Math.ceil(driverCount / this.chunkSize);

          for (let i = 0; i < driverPages; i++) {
            const drivers = await this.driverRepository.find({
              select: ['id', 'fullName', 'email', 'deviceToken'],
              where: driverWhere,
              take: this.chunkSize,
              skip: i * this.chunkSize,
            });

            for (const driver of drivers) {
              if (notice.sendType === ENoticeSendType.Email && driver.email) {
                const mailHistory = new MailHistoryEntity();
                mailHistory.to = driver.email;
                mailHistory.subject = notice.title;
                mailHistory.body = notice.content;

                await this.mailHistoriesService.save(mailHistory);
              }
            }
          }
          break;
      }

      notice.isSent = true;
      await this.noticeRepository.save(notice);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: !CRONJOB,
  })
  async sendMailHistories() {
    const where = { isSent: false, retryCount: LessThan(this.retryCount) };
    const count = await this.mailHistoriesService.count({ where });
    const pages = Math.ceil(count / this.chunkSize);

    for (let i = 0; i < pages; i++) {
      const mailHistories = await this.mailHistoriesService.find({
        where,
        take: this.chunkSize,
        skip: i * this.chunkSize,
      });

      for (const mailHistory of mailHistories) {
        await this.mailHistoriesService.sendMail(mailHistory);
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: !CRONJOB,
  })
  async autoCancelOrders() {
    const now = new Date();
    const limit = new Date(now.getTime() - STORE_CONFIRM_TIME * 60 * 1000);

    // const orders = await this.orderService
    //   .createQueryBuilder('order')
    //   .select(['order.id', 'order.clientId'])
    //   .addSelect(['store.id', 'store.merchantId'])
    //   .innerJoin('order.store', 'store')
    //   .where('order.status = :status', { status: EOrderStatus.Pending })
    //   .andWhere('order.createdAt < :limit', { limit })
    //   .getMany();

    // for (const order of orders) {
    // await this.orderService.cancelOrder(order.store.merchantId, order.id, { reasons: 'auto_cancel' });
    // }
  }
}
