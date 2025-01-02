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

@Injectable()
export class TasksService {
  private readonly chunkSize = 100;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,

    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,

    private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: false,
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
    disabled: false,
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
          // đếm số lượng merchant
          // chia ra nhiều lần gửi
          // gửi thông báo cho merchant

          const where = { role: EMerchantRole.Owner };
          const count = await this.merchantRepository.count({ where });
          const pages = Math.ceil(count / this.chunkSize);

          for (let i = 0; i < pages; i++) {
            const merchants = await this.merchantRepository.find({
              where,
              take: this.chunkSize,
              skip: i * this.chunkSize,
            });

            for (const merchant of merchants) {
              // Send notice to merchant here
              // ...
              // ...
            }
          }

          break;
        case EAppType.AppDriver:
          // Send notice to driver here
          // ...
          // ...
          break;
      }

      notice.isSent = true;
      await this.noticeRepository.save(notice);
    }
  }
}
