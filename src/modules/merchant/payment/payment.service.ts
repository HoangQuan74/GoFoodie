import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentService as PaymentCommonService } from 'src/modules/payment/payment.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { compareText, generateRandomString } from 'src/utils/bcrypt';
import {
  EAccountType,
  EPaymentMethod,
  ERoleType,
  ETransactionStatus,
  ETransactionType,
  EUserType,
} from 'src/common/enums';
import { StoresService } from '../stores/stores.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { IPaymentResult } from 'src/common/interfaces/payment.interface';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EXCEPTIONS } from 'src/common/constants';
import * as moment from 'moment-timezone';
import { FeeService } from '../fee/fee.service';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { ESocketEvent } from 'src/common/enums/socket.enum';
import { StoreCoinHistoryEntity } from 'src/database/entities/store-coin-history.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(StoreTransactionHistoryEntity)
    private readonly transactionHistoryRepository: Repository<StoreTransactionHistoryEntity>,

    @InjectRepository(StoreCoinHistoryEntity)
    private readonly storeCoinHistoryRepository: Repository<StoreCoinHistoryEntity>,

    private readonly paymentCommonService: PaymentCommonService,
    private readonly storeService: StoresService,
    private readonly feeService: FeeService,
    private dataSource: DataSource,
    private eventGatewayService: EventGatewayService,
  ) {}

  async deposit(data: CreateDepositDto, storeId: number) {
    const { amount, returnUrl, method } = data;
    const description = 'Nạp tiền vào tài khoản';
    const invoiceNo = await this.createInvoiceNo(ETransactionType.Deposit);
    const balance = await this.storeService.getBalance(storeId);

    const newTransaction = new StoreTransactionHistoryEntity();
    newTransaction.amount = amount;
    newTransaction.description = description;
    newTransaction.invoiceNo = invoiceNo;
    newTransaction.storeId = storeId;
    newTransaction.type = ETransactionType.Deposit;
    newTransaction.balance = Number(balance) + amount;
    newTransaction.method = method;

    await this.transactionHistoryRepository.save(newTransaction);
    return this.paymentCommonService.createPaymentUrl({ amount, returnUrl, method, description, invoiceNo });
  }

  async updateTransactionStatus(invoiceNo: string, status: ETransactionStatus, result: IPaymentResult) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(StoreTransactionHistoryEntity, {
        where: { invoiceNo, status: ETransactionStatus.Pending },
      });
      if (!transaction) return;

      const store = await manager.findOne(StoreEntity, { where: { id: transaction.storeId } });
      const { merchantId, balance } = store;

      if (status === ETransactionStatus.Success) {
        transaction.status = status;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Deposit) {
          store.balance = Number(balance) + transaction.amount;
          await manager.save(store);
        }
      } else if (status === ETransactionStatus.Failed) {
        transaction.status = status;
        transaction.errorMessage = result.failure_reason;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Withdraw) {
          store.balance = Number(balance) + transaction.amount + transaction.fee;
          await manager.save(store);
        }
      }

      this.eventGatewayService.sendEventToUser(merchantId, ERoleType.Merchant, ESocketEvent.TransactionResult, {
        transaction,
      });
      await manager.save(transaction);
    });
  }

  async withdraw(data: CreateWithdrawDto, storeId: number) {
    const { amount, accountType, accountName, pin } = data;
    const account = await this.paymentCommonService.checkAccount(data);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);
    const isNameMatch = compareText(account.account_name, accountName);
    if (!isNameMatch) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    const description = 'Rut tien';
    const invoiceNo = await this.createInvoiceNo(ETransactionType.Withdraw);

    return this.dataSource.transaction(async (manager) => {
      const store = await manager.findOne(StoreEntity, { select: ['id', 'balance', 'pin'], where: { id: storeId } });
      if (!store) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
      if (store.pin && store.pin !== pin) throw new BadRequestException(EXCEPTIONS.PIN_INCORRECT);
      if (store.balance < amount) throw new BadRequestException(EXCEPTIONS.NOT_ENOUGH_BALANCE);
      const fee = await this.feeService.getTransactionFee();
      const feeAmount = Math.floor((amount * fee) / 100);

      store.balance = Number(store.balance) - amount - feeAmount;
      await manager.save(store);

      const newTransaction = new StoreTransactionHistoryEntity();
      newTransaction.amount = amount;
      newTransaction.description = description;
      newTransaction.invoiceNo = invoiceNo;
      newTransaction.storeId = storeId;
      newTransaction.type = ETransactionType.Withdraw;
      newTransaction.balance = store.balance;
      newTransaction.fee = feeAmount;
      newTransaction.bankAccount = data.accountNo;
      newTransaction.bankAccountName = data.accountName;

      if (accountType === EAccountType.BankAccount) {
        newTransaction.method = EPaymentMethod.Collection;
      } else {
        newTransaction.method = EPaymentMethod.AtmCard;
      }

      await this.paymentCommonService.createDisbursement({ ...data, description, requestId: invoiceNo });

      setTimeout(() => {
        this.paymentCommonService.getManualResult(invoiceNo).then((result) => {
          this.paymentCommonService.handleIPN9Pay(result);
        });
      }, 30000);

      return manager.save(newTransaction);
    });
  }

  private async createInvoiceNo(transactionType: ETransactionType, randomString?: string) {
    if (!randomString) randomString = generateRandomString(10, true);
    const prefixUserType = Object.values(EUserType).indexOf(EUserType.Merchant);
    const prefixTransactionType = Object.values(ETransactionType).indexOf(transactionType);
    const invoiceNo = `${prefixUserType}${prefixTransactionType}${randomString}`;

    const checkInvoiceNo = await this.transactionHistoryRepository.existsBy({ invoiceNo });
    if (!checkInvoiceNo) return invoiceNo;

    return this.createInvoiceNo(transactionType);
  }

  async createInvoiceNoCoin(transactionType: ETransactionType, randomString?: string) {
    if (!randomString) randomString = generateRandomString(10, true);
    const prefixUserType = Object.values(EUserType).indexOf(EUserType.Merchant);
    const prefixTransactionType = Object.values(ETransactionType).indexOf(transactionType);
    const invoiceNo = `${prefixUserType}${prefixTransactionType}${randomString}`;

    const checkInvoiceNo = await this.storeCoinHistoryRepository.existsBy({ invoiceNo });
    if (!checkInvoiceNo) return invoiceNo;

    return this.createInvoiceNoCoin(transactionType);
  }

  createQueryBuilder(alias: string) {
    return this.transactionHistoryRepository.createQueryBuilder(alias);
  }

  // async getPendingTransactions() {
  //   const time = moment().subtract(30, 'minutes').toDate();
  //   return this.transactionHistoryRepository.find({
  //     where: { status: ETransactionStatus.Pending, createdAt: LessThan(time) },
  //   });
  // }

  async getPendingBalance(storeId: number) {
    const transactions = await this.transactionHistoryRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount + transaction.fee)', 'total')
      .where('transaction.storeId = :storeId', { storeId })
      .andWhere('transaction.status = :status', { status: ETransactionStatus.Pending })
      .getRawOne();

    return transactions.total || 0;
  }

  // xử lí các giao dịch chưa được xác nhận sau 30 phút
  async handlePendingTransactions() {
    const time = moment().subtract(30, 'minutes').toDate();

    const countStoreTransaction = await this.transactionHistoryRepository.countBy({
      status: ETransactionStatus.Pending,
      createdAt: LessThan(time),
    });

    if (countStoreTransaction > 0) {
      // chia batch 100 giao dịch
      const batch = 100;
      const pages = Math.ceil(countStoreTransaction / batch);

      this.dataSource.transaction(async (manager) => {
        for (let i = 0; i < pages; i++) {
          const transactions = await manager.find(StoreTransactionHistoryEntity, {
            where: { status: ETransactionStatus.Pending, createdAt: LessThan(time) },
            take: batch,
            skip: i * batch,
          });

          for (const transaction of transactions) {
            const result = await this.paymentCommonService.getManualResult(transaction.invoiceNo);
            await this.paymentCommonService.handleIPN9Pay(result);
          }
        }
      });
    }

    const countStoreCoinTransaction = await this.storeCoinHistoryRepository.countBy({
      status: ETransactionStatus.Pending,
      createdAt: LessThan(time),
      method: In([EPaymentMethod.AtmCard, EPaymentMethod.Collection, EPaymentMethod.CreditCard]),
    });

    if (countStoreCoinTransaction > 0) {
      // chia batch 100 giao dịch
      const batch = 100;
      const pages = Math.ceil(countStoreCoinTransaction / batch);

      this.dataSource.transaction(async (manager) => {
        for (let i = 0; i < pages; i++) {
          const transactions = await manager.find(StoreCoinHistoryEntity, {
            where: {
              status: ETransactionStatus.Pending,
              createdAt: LessThan(time),
              method: In([EPaymentMethod.AtmCard, EPaymentMethod.Collection, EPaymentMethod.CreditCard]),
            },
            take: batch,
            skip: i * batch,
          });

          for (const transaction of transactions) {
            const result = await this.paymentCommonService.getManualResult(transaction.invoiceNo);
            await this.paymentCommonService.handleIPN9Pay(result);
          }
        }
      });
    }
  }
}
