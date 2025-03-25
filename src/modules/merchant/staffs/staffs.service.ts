import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantOperationEntity } from 'src/database/entities/merchant-operation.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { EStaffRole, EStaffStatus } from 'src/common/enums';
import { StoreStaffEntity } from 'src/database/entities/store-staff.entity';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { MerchantsService } from '../merchants/merchants.service';
import * as moment from 'moment';
import { EXCEPTIONS } from 'src/common/constants';
import { MerchantRoleEntity } from 'src/database/entities/merchant-role.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(MerchantOperationEntity)
    private readonly operationRepository: Repository<MerchantOperationEntity>,

    @InjectRepository(StoreStaffEntity)
    private readonly storeStaffRepository: Repository<StoreStaffEntity>,

    @InjectRepository(MerchantRoleEntity)
    private readonly roleRepository: Repository<MerchantRoleEntity>,

    private readonly merchantService: MerchantsService,
  ) {}

  async getStaffs(storeId: number) {
    return this.storeStaffRepository.find({
      select: { merchant: { id: true, name: true, email: true, phone: true, avatarId: true } },
      where: { storeId },
      relations: { merchant: true },
    });
  }

  async getOperations(roleCode?: EStaffRole) {
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.roles', 'role', 'role.code = :roleCode', { roleCode })
      .getMany();

    const groupedOperations = _.groupBy(operations, 'groupId');

    return Object.keys(groupedOperations).map((key) => {
      return {
        groupId: key,
        groupName: groupedOperations[key][0].groupName,
        operations: groupedOperations[key].map((operation) => ({
          code: operation.code,
          name: operation.name,
          description: operation.description,
          selected: operation.roles.length > 0,
        })),
      };
    });
  }

  async getInvitations(staffId: number) {
    return this.storeStaffRepository.find({
      select: { store: { id: true, name: true } },
      where: { merchantId: staffId, status: EStaffStatus.Pending },
      relations: ['store'],
    });
  }

  async getPermissions(merchantId: number, storeId: number) {}

  async inviteStaff(storeId: number, data: InviteStaffDto) {
    const { email, phone, name, roleCode } = data;
    const expiredAt = moment().add(7, 'days').toDate();

    let merchant = await this.merchantService.findOne({ where: [{ email }, { phone }] });
    if (!merchant) merchant = await this.merchantService.save({ name, email, phone, emailVerifiedAt: new Date() });

    const { id: merchantId } = merchant;

    let storeStaff = await this.storeStaffRepository.findOne({ where: { storeId, merchantId }, withDeleted: true });
    !storeStaff && (storeStaff = new StoreStaffEntity());

    storeStaff.deletedAt && storeStaff.status === EStaffStatus.Pending;
    storeStaff.expiredAt = expiredAt;
    storeStaff.deletedAt = null;
    storeStaff.storeId = storeId;
    storeStaff.roleCode = roleCode;
    storeStaff.merchantId = merchantId;

    return this.storeStaffRepository.save(storeStaff);
  }

  async getStaffDetail(staffId: number, storeId: number) {
    const staff = await this.storeStaffRepository.findOne({
      select: { merchant: { id: true, name: true, email: true, phone: true, avatarId: true } },
      where: { merchantId: staffId, storeId },
      relations: { merchant: true, operations: true },
    });

    if (!staff) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
  }

  async deleteStaff(staffId: number, storeId: number) {
    const staff = await this.storeStaffRepository.findOne({ where: { merchantId: staffId, storeId } });
    if (!staff) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.storeStaffRepository.softRemove(staff);
  }

  async getRoles() {
    return this.roleRepository.find();
  }
}
