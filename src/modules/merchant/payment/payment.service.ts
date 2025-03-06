import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentService as PaymentCommonService } from 'src/modules/payment/payment.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { DataSource, Repository } from 'typeorm';
import { generateRandomString } from 'src/utils/bcrypt';
import { EAccountType, EPaymentMethod, ETransactionStatus, ETransactionType, EUserType } from 'src/common/enums';
import { StoresService } from '../stores/stores.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { IPaymentResult } from 'src/common/interfaces/payment.interface';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EXCEPTIONS } from 'src/common/constants';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(StoreTransactionHistoryEntity)
    private readonly transactionHistoryRepository: Repository<StoreTransactionHistoryEntity>,

    private readonly paymentCommonService: PaymentCommonService,
    private readonly storeService: StoresService,
    private dataSource: DataSource,
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

      if (status === ETransactionStatus.Success) {
        transaction.status = status;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Deposit) {
          const store = await manager.findOne(StoreEntity, { where: { id: transaction.storeId } });
          store.balance = Number(store.balance) + transaction.amount;
          await manager.save(store);
        }
      } else if (status === ETransactionStatus.Failed) {
        transaction.status = status;
        transaction.errorMessage = result.failure_reason;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Deposit) {
          const store = await manager.findOne(StoreEntity, { where: { id: transaction.storeId } });
          store.balance = Number(store.balance) + transaction.amount;
          await manager.save(store);
        }
      }

      await manager.save(transaction);
    });
  }

  async withdraw(data: CreateWithdrawDto, storeId: number) {
    const { amount, accountType } = data;
    const description = 'Rut tien';
    const invoiceNo = await this.createInvoiceNo(ETransactionType.Withdraw);

    return this.dataSource.transaction(async (manager) => {
      const store = await manager.findOne(StoreEntity, { where: { id: storeId } });
      if (store.balance < amount) throw new BadRequestException(EXCEPTIONS.NOT_ENOUGH_BALANCE);

      store.balance = Number(store.balance) - amount;
      await manager.save(store);

      const newTransaction = new StoreTransactionHistoryEntity();
      newTransaction.amount = amount;
      newTransaction.description = description;
      newTransaction.invoiceNo = invoiceNo;
      newTransaction.storeId = storeId;
      newTransaction.type = ETransactionType.Withdraw;
      newTransaction.balance = store.balance;
      newTransaction.bankAccount = data.accountNo;
      newTransaction.bankAccountName = data.accountName;

      if (accountType === EAccountType.BankAccount) {
        newTransaction.method = EPaymentMethod.Collection;
      } else {
        newTransaction.method = EPaymentMethod.AtmCard;
      }

      console.log('Withdraw data', invoiceNo);

      await this.paymentCommonService
        .createDisbursement({ ...data, description, requestId: invoiceNo })
        .catch((error) => {
          console.log('Withdraw error', error.response.data);
          throw new BadRequestException(error);
        });
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

  createQueryBuild(alias: string) {
    return this.transactionHistoryRepository.createQueryBuilder(alias);
  }
}
