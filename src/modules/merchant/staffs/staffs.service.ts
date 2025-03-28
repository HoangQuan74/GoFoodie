import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantOperationEntity } from 'src/database/entities/merchant-operation.entity';
import { Brackets, In, Repository } from 'typeorm';
import * as _ from 'lodash';
import { EStaffRole, EStaffStatus } from 'src/common/enums';
import { StoreStaffEntity } from 'src/database/entities/store-staff.entity';
import { InviteStaffDto } from './dto/invite-staff.dto';
import { MerchantsService } from '../merchants/merchants.service';
import * as moment from 'moment';
import { EXCEPTIONS } from 'src/common/constants';
import { MerchantRoleEntity } from 'src/database/entities/merchant-role.entity';
import { QueryStaffDto } from './dto/query-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

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

  async getStaffs(storeId: number, query: QueryStaffDto) {
    const { search, status, roleCode } = query;

    const queryBuilder = this.storeStaffRepository
      .createQueryBuilder('staff')
      .addSelect(['merchant.id', 'merchant.name', 'merchant.email', 'merchant.phone', 'merchant.avatarId'])
      .leftJoin('staff.merchant', 'merchant')
      .where('staff.storeId = :storeId', { storeId });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('merchant.name ILIKE :search');
          qb.orWhere('merchant.email ILIKE :search');
          qb.orWhere('merchant.phone ILIKE :search');
        }),
      );
      queryBuilder.setParameter('search', `%${search}%`);
    }

    roleCode && queryBuilder.andWhere('staff.roleCode = :roleCode', { roleCode });
    status && queryBuilder.andWhere('staff.status = :status', { status });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async getOperations(roleCode?: EStaffRole) {
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .addSelect(['role.code'])
      .leftJoin('operation.roles', 'role', 'role.code = :roleCode', { roleCode })
      .addSelect(['dependency.code'])
      .leftJoin('operation.dependencies', 'dependency')
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
          dependencies: operation.dependencies.map((dependency) => ({ code: dependency.code })),
        })),
      };
    });
  }

  async getInvitations(merchantId: number) {
    return this.storeStaffRepository.find({
      select: { store: { id: true, name: true } },
      where: { merchantId, status: EStaffStatus.Pending },
      relations: ['store'],
    });
  }

  async getPermissions(merchantId: number, storeId: number) {
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .addSelect(['staff.id'])
      .leftJoin('operation.staffs', 'staff', 'staff.merchantId = :merchantId AND staff.storeId = :storeId')
      .setParameters({ merchantId, storeId })
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
          selected: !!operation.staffs.length,
        })),
      };
    });
  }

  async inviteStaff(storeId: number, data: InviteStaffDto) {
    const { email, phone, name, roleCode, operationCodes } = data;
    const expiredAt = moment().add(7, 'days').toDate();

    let merchant = await this.merchantService.findOne({ where: [{ email }, { phone }] });
    if (!merchant) merchant = await this.merchantService.save({ name, email, phone, emailVerifiedAt: new Date() });

    const { id: merchantId } = merchant;

    let storeStaff = await this.storeStaffRepository.findOne({ where: { storeId, merchantId }, withDeleted: true });
    !storeStaff && (storeStaff = new StoreStaffEntity());

    const operations = await this.operationRepository.find({ where: { code: In(operationCodes) } });

    storeStaff.deletedAt && storeStaff.status === EStaffStatus.Pending;
    storeStaff.expiredAt = expiredAt;
    storeStaff.deletedAt = null;
    storeStaff.storeId = storeId;
    storeStaff.roleCode = roleCode;
    storeStaff.merchantId = merchantId;
    storeStaff.operations = operations;

    return this.storeStaffRepository.save(storeStaff);
  }

  async getStaffDetail(merchantId: number, storeId: number) {
    const staff = await this.storeStaffRepository.findOne({
      select: { merchant: { id: true, name: true, email: true, phone: true, avatarId: true } },
      where: { merchantId, storeId },
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

  async updateStaff(merchantId: number, storeId: number, data: UpdateStaffDto) {
    const staff = await this.storeStaffRepository.findOne({ where: { merchantId, storeId } });
    if (!staff) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    const { roleCode, operationCodes, name } = data;
    const operations = await this.operationRepository.find({ where: { code: In(operationCodes) } });

    staff.roleCode = roleCode;
    staff.operations = operations;
    staff.merchant.name = name;

    return this.storeStaffRepository.save(staff);
  }

  async rejectInvitation(merchantId: number, storeId: number) {
    const staff = await this.storeStaffRepository.findOneBy({ merchantId, storeId, status: EStaffStatus.Pending });
    if (!staff) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return this.storeStaffRepository.softRemove(staff);
  }

  async acceptInvitation(merchantId: number, storeId: number) {
    const staff = await this.storeStaffRepository.findOneBy({ merchantId, storeId, status: EStaffStatus.Pending });
    if (!staff) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    if (staff.expiredAt < new Date()) throw new BadRequestException(EXCEPTIONS.EXPIRED);

    staff.status = EStaffStatus.Active;
    return this.storeStaffRepository.save(staff);
  }
}
