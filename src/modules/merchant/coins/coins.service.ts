import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreCoinHistoryEntity } from 'src/database/entities/store-coin-history.entity';
import { DataSource, Repository } from 'typeorm';
import { EPaymentMethod, EStoreCoinType, ETransactionStatus, ETransactionType } from 'src/common/enums';
import { CreateCoinDto, QueryCoinDto } from './dto';
import { StoreEntity } from 'src/database/entities/store.entity';
import { PaymentService as PaymentCommonService } from 'src/modules/payment/payment.service';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { EXCEPTIONS } from 'src/common/constants';
import { IPaymentResult } from 'src/common/interfaces/payment.interface';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(StoreCoinHistoryEntity)
    private readonly coinHistoryRepository: Repository<StoreCoinHistoryEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(StoreTransactionHistoryEntity)
    private readonly transactionHistoryRepository: Repository<StoreTransactionHistoryEntity>,

    private readonly paymentCommonService: PaymentCommonService,
    private dataSource: DataSource,
  ) {}

  async getCoinOfStore(storeId: number) {
    const coin = await this.storeRepository.findOne({
      where: { id: storeId },
      select: {
        balance: true,
        coinBalance: true,
        promotionCoinBalance: true,
      },
    });
    return {
      balance: Number(coin.balance),
      coinBalance: Number(coin.coinBalance),
      promotionCoinBalance: Number(coin.promotionCoinBalance),
    };
  }

  async addCoin(storeId: number, data: CreateCoinDto) {
    const { amount, returnUrl, method, pin } = data;
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      select: {
        balance: true,
        coinBalance: true,
        promotionCoinBalance: true,
        pin: true,
      },
    });
    if (!store) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    const invoiceNo = await this.paymentCommonService.createInvoiceNo(ETransactionType.RechargeCoin);

    if (method === EPaymentMethod.Wallet) {
      await this.handleWalletTopUp(storeId, amount, invoiceNo, store);
      await this.updateStoreBalance(storeId, amount, store);
      await this.saveCoinHistory(storeId, data, invoiceNo, store, ETransactionStatus.Success);
      return true;
    }

    if (store.pin && store.pin !== pin) throw new BadRequestException(EXCEPTIONS.PIN_INCORRECT);

    await this.saveCoinHistory(storeId, data, invoiceNo, store);
    return this.createPaymentUrl(amount, returnUrl, method, invoiceNo);
  }

  private async updateStoreBalance(storeId: number, amount: number, store: StoreEntity) {
    await this.storeRepository.update(
      { id: storeId },
      { coinBalance: Number(store.coinBalance) + amount, balance: Number(store.balance) - amount },
    );
  }

  private async saveCoinHistory(
    storeId: number,
    data: CreateCoinDto,
    invoiceNo: string,
    store: StoreEntity,
    status: ETransactionStatus = ETransactionStatus.Pending,
  ) {
    const { amount, method } = data;
    await this.coinHistoryRepository.save({
      invoiceNo,
      status,
      storeId,
      amount,
      method,
      balance: Number(store.coinBalance) + amount,
      type: EStoreCoinType.SHOP_TOPUP,
      description: 'Nạp xu',
    });
  }

  private async createPaymentUrl(amount: number, returnUrl: string, method: EPaymentMethod, invoiceNo: string) {
    const description = 'Nạp xu';

    return this.paymentCommonService.createPaymentUrl({
      amount,
      returnUrl,
      method: method,
      description,
      invoiceNo,
    });
  }

  private async handleWalletTopUp(storeId: number, amount: number, invoiceNo: string, store: StoreEntity) {
    if (amount > Number(store.balance)) {
      throw new BadRequestException(EXCEPTIONS.NOT_ENOUGH_BALANCE);
    }

    await this.createStoreTransactionWallet(storeId, amount, Number(store.balance), invoiceNo);
  }
  private async createStoreTransactionWallet(storeId: number, amount: number, storeBalance: number, invoiceNo: string) {
    const description = 'Nạp xu';

    const newTransaction = new StoreTransactionHistoryEntity();
    newTransaction.amount = amount;
    newTransaction.description = description;
    newTransaction.invoiceNo = invoiceNo;
    newTransaction.storeId = storeId;
    newTransaction.type = ETransactionType.RechargeCoin;
    newTransaction.balance = storeBalance - amount;
    newTransaction.method = EPaymentMethod.Wallet;
    newTransaction.status = ETransactionStatus.Success;

    await this.transactionHistoryRepository.save(newTransaction);
  }

  async updateTransactionStatus(invoiceNo: string, status: ETransactionStatus, result: IPaymentResult) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(StoreCoinHistoryEntity, {
        where: { invoiceNo, status: ETransactionStatus.Pending },
      });
      if (!transaction) return;

      transaction.status = status;
      transaction.transactionId = result.payment_no;

      if (status === ETransactionStatus.Success) {
        const store = await manager.findOne(StoreEntity, { where: { id: transaction.storeId } });
        store.coinBalance = Number(store.coinBalance) + Number(transaction.amount);
        await manager.save(store);
      } else if (status === ETransactionStatus.Failed) {
        transaction.errorMessage = result.failure_reason;
      }

      await manager.save(transaction);
    });
  }

  async getCoinHistoryOfStore(storeId: number, query: QueryCoinDto) {
    const { limit, page, type, startDate, endDate, status } = query;
    const queryBuilder = this.coinHistoryRepository
      .createQueryBuilder('coinHistory')
      .where('coinHistory.storeId = :storeId', { storeId });

    if (type) queryBuilder.andWhere('coinHistory.type = :type', { type });
    if (startDate) queryBuilder.andWhere('coinHistory.createdAt >= :startDate', { startDate });
    if (endDate) queryBuilder.andWhere('coinHistory.createdAt <= :endDate', { endDate });
    if (status) queryBuilder.andWhere('coinHistory.status = :status', { status });

    queryBuilder.orderBy('coinHistory.createdAt', 'DESC');
    const [items, total] = await queryBuilder
      .skip(limit * (page - 1))
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  async getCoinHistoryDetail(storeId: number, id: number) {
    return this.coinHistoryRepository.findOne({
      where: { id, storeId },
      relations: ['store'],
      select: {
        store: {
          id: true,
          name: true,
        },
      },
    });
  }
}
