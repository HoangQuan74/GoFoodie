import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientReviewDriverEntity } from 'src/database/entities/client-review-driver.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { ReviewDriverDto } from './dto/review-driver.dto';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { ReviewStoreDto } from './dto/review-store.dto';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';
import * as _ from 'lodash';
import { DriverView } from 'src/database/views/driver.view';
import { CoinsService } from '../coins/coins.service';
import { ClientEntity } from 'src/database/entities/client.entity';
import { ClientCoinHistoryEntity } from 'src/database/entities/client-coin-history.entity';
import { EClientCoinType } from 'src/common/enums';
import moment from 'moment-timezone';
import { TIMEZONE } from 'src/common/constants';

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

    private readonly dataSource: DataSource,
    private readonly coinsService: CoinsService,
  ) {}

  async reviewDriver(orderId: number, clientId: number, reviewDriverDto: ReviewDriverDto) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        select: { id: true, driverId: true, storeId: true },
        where: { id: orderId, clientId, status: EOrderStatus.Delivered },
      });
      if (!order) throw new NotFoundException();

      const reviewDriver = await manager.findOne(ClientReviewDriverEntity, { where: { orderId, clientId } });
      if (reviewDriver) throw new ConflictException();

      const { driverId, storeId } = order;

      const review = await manager.save(ClientReviewDriverEntity, { orderId, clientId, driverId, ...reviewDriverDto });
      const reviewStore = await manager.existsBy(ClientReviewStoreEntity, { orderId, clientId, storeId });
      const rewardRepository = manager.getRepository(ChallengeEntity);
      const reward = await this.getReward(rewardRepository);

      if (reviewStore && reward) {
        const { reward: rewardAmount, duration } = reward;
        const expiredAt = moment().tz(TIMEZONE).add(duration, 'days').endOf('day').toDate();

        const client = await manager.findOne(ClientEntity, { select: ['coins'], where: { id: clientId } });
        await manager.update(ClientEntity, { id: clientId }, { coins: () => `coins + ${rewardAmount}` });
        await manager.update(ChallengeEntity, { id: reward.id }, { usedBudget: () => `usedBudget + ${rewardAmount}` });

        await manager.save(ClientCoinHistoryEntity, {
          clientId,
          amount: rewardAmount,
          type: EClientCoinType.Review,
          expiredAt: expiredAt,
          relatedId: orderId,
          balance: Number(client.coins) + rewardAmount,
        });
      }

      return review;
    });
  }

  async reviewStore(orderId: number, clientId: number, reviewStoreDto: ReviewStoreDto) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        select: { id: true, storeId: true, driverId: true },
        where: { id: orderId, clientId, status: EOrderStatus.Delivered },
      });
      if (!order) throw new NotFoundException();

      const reviewStore = await manager.findOne(ClientReviewStoreEntity, { where: { orderId, clientId } });
      if (reviewStore) throw new ConflictException();

      const { storeId, driverId } = order;

      const review = await manager.save(ClientReviewStoreEntity, { orderId, clientId, storeId, ...reviewStoreDto });
      const reviewDriver = await manager.existsBy(ClientReviewDriverEntity, { orderId, clientId, driverId });
      const rewardRepository = manager.getRepository(ChallengeEntity);
      const reward = await this.getReward(rewardRepository);

      if (reviewDriver && reward) {
        const { reward: rewardAmount, duration } = reward;
        const expiredAt = moment().tz(TIMEZONE).add(duration, 'days').endOf('day').toDate();

        const client = await manager.findOne(ClientEntity, { select: ['coins'], where: { id: clientId } });
        await manager.update(ClientEntity, { id: clientId }, { coins: () => `coins + ${rewardAmount}` });
        await manager.update(ChallengeEntity, { id: reward.id }, { usedBudget: () => `usedBudget + ${rewardAmount}` });

        await manager.save(ClientCoinHistoryEntity, {
          clientId,
          amount: rewardAmount,
          type: EClientCoinType.Review,
          expiredAt: expiredAt,
          relatedId: orderId,
          balance: Number(client.coins) + rewardAmount,
        });
      }

      return review;
    });
  }

  async getDriverReview(orderId: number, clientId: number) {
    const review = await this.reviewDriverRepository
      .createQueryBuilder('review')
      .select([
        'review.id as id',
        'review.rating as rating',
        'review.comment as comment',
        'review.createdAt as "createdAt"',
        'templates.id as "templateId"',
        'templates.name as "templateName"',
        'driver.id as "driverId"',
        'driver.avatar as "driverAvatar"',
        'driver.avgRating as "driverAvgRating"',
        'driver.fullName as "driverFullName"',
      ])
      .where('review.orderId = :orderId', { orderId })
      .andWhere('review.clientId = :clientId', { clientId })
      .leftJoin('review.templates', 'templates')
      .leftJoin(DriverView, 'driver', 'driver.id = review.driverId')
      .getRawMany();

    if (!review.length) return null;

    const groupedReview = _.groupBy(review, 'id');
    return Object.values(groupedReview).map((reviews: any[]) => {
      const templates = reviews.map((r) => ({ id: r.templateId, name: r.templateName }));
      delete reviews[0].templateId;
      delete reviews[0].templateName;

      return { ...reviews[0], templates };
    });
  }

  async getStoreReview(orderId: number, clientId: number) {
    return await this.reviewStoreRepository
      .createQueryBuilder('review')
      .select([
        'review.id',
        'review.rating',
        'review.isAnonymous',
        'review.comment',
        'review.createdAt',
        'templates.id',
        'templates.name',
      ])
      .addSelect(['store.id', 'store.storeAvatarId', 'store.name', 'store.specialDish', 'store.streetName'])
      .addSelect(['files.id', 'files.name'])
      .where('review.orderId = :orderId', { orderId })
      .andWhere('review.clientId = :clientId', { clientId })
      .leftJoin('review.templates', 'templates')
      .leftJoin('review.store', 'store')
      .leftJoin('review.files', 'files')
      .getOne();
  }

  async getReward(repository: Repository<ChallengeEntity> = this.challengeRepository) {
    return repository
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
