import { Injectable } from '@nestjs/common';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantOtpEntity } from 'src/database/entities/merchant-otp.entity';
import { EAdminOtpType } from 'src/common/enums';
import { OTP_EXPIRATION } from 'src/common/constants';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantsRepository: Repository<MerchantEntity>,

    @InjectRepository(MerchantOtpEntity)
    private merchantOtpRepository: Repository<MerchantOtpEntity>,
  ) {}

  async save(merchant: Partial<MerchantEntity>) {
    return this.merchantsRepository.save(merchant);
  }

  async find(options: FindManyOptions<MerchantEntity>) {
    return this.merchantsRepository.find(options);
  }

  async findOne(options: FindOneOptions<MerchantEntity>) {
    return this.merchantsRepository.findOne(options);
  }

  createQueryBuilder(alias: string) {
    return this.merchantsRepository.createQueryBuilder(alias);
  }

  async saveOtp(entity: Partial<MerchantOtpEntity>) {
    entity.expiredAt = new Date(Date.now() + OTP_EXPIRATION * 60 * 1000);
    return this.merchantOtpRepository.save(entity);
  }

  async deleteOtp(merchantId: number, type: EAdminOtpType) {
    return this.merchantOtpRepository.delete({ merchantId, type });
  }

  async validateOtp(merchantId: number, otp: string) {
    const otpEntity = await this.merchantOtpRepository.findOne({
      where: { merchantId, otp, expiredAt: MoreThan(new Date()), isUsed: false },
    });
    return !!otpEntity;
  }
}
