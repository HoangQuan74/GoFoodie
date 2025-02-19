import { Injectable } from '@nestjs/common';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { TIMEZONE } from 'src/common/constants';
import { generateRandomString } from 'src/utils/bcrypt';
import { RequestTypeEntity } from 'src/database/entities/request-type.entity';
import { EAppType } from 'src/common/enums/config.enum';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(DriverRequestEntity)
    private readonly requestRepository: Repository<DriverRequestEntity>,

    @InjectRepository(RequestTypeEntity)
    private readonly requestTypeRepository: Repository<RequestTypeEntity>,

    @InjectRepository(OrderGroupEntity)
    private orderGroupRepository: Repository<OrderGroupEntity>,
  ) {}

  save(entity: DeepPartial<DriverRequestEntity>) {
    return this.requestRepository.save(entity);
  }

  async findOne(options: FindOneOptions<DriverRequestEntity>) {
    return this.requestRepository.findOne(options);
  }

  createQueryBuilder(alias?: string) {
    return this.requestRepository.createQueryBuilder(alias);
  }

  async generateCode() {
    const date = moment().tz(TIMEZONE).format('YYYY-MM-DD');
    const randomString = generateRandomString(8);
    const code = `${date}${randomString}`;

    const codeIsExist = await this.requestRepository.findOne({ where: { code } });
    if (codeIsExist) return this.generateCode();

    return code;
  }

  async getTypes() {
    return this.requestTypeRepository.findBy({ appTypes: { value: EAppType.AppDriver }, isActive: true });
  }
}
