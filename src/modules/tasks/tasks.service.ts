import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { deleteFile } from 'src/utils/file';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Ho_Chi_Minh',
    disabled: true,
  })
  async cleanUpGarbageFiles() {
    const duration = 24 * 60 * 60 * 1000;
    const files = await this.fileRepository.findBy({ createdAt: LessThan(new Date(Date.now() - duration)) });

    for (const file of files) {
      await this.fileRepository
        .remove(file)
        .then(() => deleteFile(file.path))
        .catch(() => {});
    }
  }
}
