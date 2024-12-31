import { Injectable } from '@nestjs/common';
import { NoticeEntity } from 'src/database/entities/notice.entity';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeTypeEntity } from 'src/database/entities/notice-type.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeEntity)
    private noticeRepository: Repository<NoticeEntity>,

    @InjectRepository(NoticeTypeEntity)
    private noticeTypeRepository: Repository<NoticeTypeEntity>,
  ) {}

  async save(entity: Partial<NoticeEntity>): Promise<NoticeEntity> {
    return this.noticeRepository.save(entity);
  }

  async find(options?: FindManyOptions<NoticeEntity>): Promise<NoticeEntity[]> {
    return this.noticeRepository.find(options);
  }

  async findOne(options: FindOneOptions<NoticeEntity>): Promise<NoticeEntity> {
    return this.noticeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<NoticeEntity>): Promise<[NoticeEntity[], number]> {
    return this.noticeRepository.findAndCount(options);
  }

  async getTypes() {
    return this.noticeTypeRepository.find();
  }

  async remove(entity: NoticeEntity) {
    return this.noticeRepository.remove(entity);
  }

  createQueryBuilder(alias: string) {
    return this.noticeRepository.createQueryBuilder(alias);
  }
}
