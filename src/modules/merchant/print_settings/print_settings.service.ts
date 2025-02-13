import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorePrintSettingEntity } from 'src/database/entities/store-print-setting.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class PrintSettingsService {
  constructor(
    @InjectRepository(StorePrintSettingEntity)
    private readonly storePrintSettingRepository: Repository<StorePrintSettingEntity>,
  ) {}

  async findOne(options: FindOneOptions<StorePrintSettingEntity>) {
    return this.storePrintSettingRepository.findOne(options);
  }

  async save(data: Partial<StorePrintSettingEntity>) {
    return this.storePrintSettingRepository.save(data);
  }
}
