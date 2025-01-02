import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailHistoryEntity } from 'src/database/entities/mail-history.entity';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailHistoriesService {
  constructor(
    @InjectRepository(MailHistoryEntity)
    private readonly mailHistoryRepository: Repository<MailHistoryEntity>,

    private readonly mailerService: MailerService,
  ) {}

  async save(entity: Partial<MailHistoryEntity>): Promise<MailHistoryEntity> {
    return this.mailHistoryRepository.save(entity);
  }

  async findOne(options: FindOneOptions<MailHistoryEntity>): Promise<MailHistoryEntity> {
    return this.mailHistoryRepository.findOne(options);
  }

  async find(options: FindManyOptions<MailHistoryEntity>): Promise<MailHistoryEntity[]> {
    return this.mailHistoryRepository.find(options);
  }

  async count(options: FindManyOptions<MailHistoryEntity>): Promise<number> {
    return this.mailHistoryRepository.count(options);
  }

  async sendMail(entity: MailHistoryEntity) {
    try {
      const sendMailOptions: ISendMailOptions = { to: entity.to, subject: entity.subject, html: entity.body };
      await this.mailerService.sendMail(sendMailOptions);

      entity.isSent = true;
      return this.save(entity);
    } catch (message) {
      console.error(message);
      entity.retryCount += 1;
      return await this.save(entity);
    }
  }
}
