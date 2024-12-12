import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP_EXPIRATION } from 'src/common/constants';
import { EAdminOtpType } from 'src/common/enums';
import { AdminOtpEntity } from 'src/database/entities/admin-otp.entity';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminsRepository: Repository<AdminEntity>,

    @InjectRepository(AdminOtpEntity)
    private adminOtpRepository: Repository<AdminOtpEntity>,
  ) {}

  save(entity: Partial<AdminEntity>) {
    return this.adminsRepository.save(entity);
  }

  find(options?: FindManyOptions<AdminEntity>) {
    return this.adminsRepository.find(options);
  }

  findOne(options: FindOneOptions<AdminEntity>) {
    return this.adminsRepository.findOne(options);
  }

  createQueryBuilder(alias: string) {
    return this.adminsRepository.createQueryBuilder(alias);
  }

  saveOtp(entity: Partial<AdminOtpEntity>) {
    entity.expiredAt = new Date(Date.now() + OTP_EXPIRATION * 60 * 1000);
    return this.adminOtpRepository.save(entity);
  }

  async deleteOtp(adminId: number, type: EAdminOtpType) {
    return this.adminOtpRepository.delete({ adminId, type });
  }

  async validateOtp(adminId: number, otp: string) {
    const otpEntity = await this.adminOtpRepository.findOne({
      where: { adminId, otp, expiredAt: MoreThan(new Date()), isUsed: false },
    });
    return !!otpEntity;
  }
}
