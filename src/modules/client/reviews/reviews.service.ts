import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientReviewDriverEntity } from 'src/database/entities/client-review-driver.entity';
import { Brackets, Repository } from 'typeorm';
import { ReviewDriverDto } from './dto/review-driver.dto';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { ReviewStoreDto } from './dto/review-store.dto';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ClientReviewDriverEntity)
    private readonly reviewDriverRepository: Repository<ClientReviewDriverEntity>,

    @InjectRepository(ClientReviewStoreEntity)
    private readonly reviewStoreRepository: Repository<ClientReviewStoreEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(ChallengeEntity)
    private readonly challengeRepository: Repository<ChallengeEntity>,
  ) {}

  async reviewDriver(orderId: number, clientId: number, reviewDriverDto: ReviewDriverDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, clientId, status: EOrderStatus.Delivered },
    });
    if (!order) throw new NotFoundException('Order not found');

    const review = await this.reviewDriverRepository.findOne({ where: { orderId, clientId } });
    if (review) throw new ConflictException('You have already reviewed this driver');

    return this.reviewDriverRepository.save({ orderId, clientId, driverId: order.driverId, ...reviewDriverDto });
  }

  async reviewStore(orderId: number, clientId: number, reviewStoreDto: ReviewStoreDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, clientId, status: EOrderStatus.Delivered },
    });
    if (!order) throw new NotFoundException('Order not found');

    const review = await this.reviewStoreRepository.findOne({ where: { orderId, clientId } });
    if (review) throw new ConflictException('You have already reviewed this store');

    return this.reviewStoreRepository.save({ orderId, clientId, storeId: order.storeId, ...reviewStoreDto });
  }

  async getReward() {
    return this.challengeRepository
      .createQueryBuilder('challenge')
      .where('challenge.typeId = 1')
      .andWhere('challenge.startTime <= :now', { now: new Date() })
      .andWhere('challenge.endTime >= :now', { now: new Date() })
      .andWhere(
        new Brackets((qb) => {
          qb.where('challenge.isLimitedBudget = FALSE');
          qb.orWhere('challenge.reward + challenge.usedBudget <= challenge.budget');
        }),
      )
      .orderBy('challenge.id', 'DESC')
      .getOne();
  }
}
