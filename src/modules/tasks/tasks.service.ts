import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { deleteFile } from 'src/utils/file';
import { DataSource, LessThan, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,

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

    const limit = 100;
    const pages = Math.ceil(count / limit);

    for (let i = 0; i < pages; i++) {
      const files = await this.fileRepository.find({
        where: { createdAt: LessThan(before) },
        take: limit,
        skip: i * limit,
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
}
