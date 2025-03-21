import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERoleType, ETransactionStatus, EUserType } from 'src/common/enums';
import { DriverTransactionHistoryEntity } from 'src/database/entities/driver-transaction-history.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ETransactionType } from 'src/common/enums';
import { BankEntity } from 'src/database/entities/bank.entity';
import { EPaymentMethod } from 'src/common/enums';
import { EAccountType } from 'src/common/enums';
import { ILike } from 'typeorm';
import { PaymentService as PaymentCommonService } from 'src/modules/payment/payment.service';
import { compareText, generateRandomString } from 'src/utils/bcrypt';
import { EXCEPTIONS } from 'src/common/constants';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { DriversService } from '../drivers/drivers.service';
import { IPaymentResult } from 'src/common/interfaces/payment.interface';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { ESocketEvent } from 'src/common/enums/socket.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(DriverTransactionHistoryEntity)
    private transactionHistoryRepository: Repository<DriverTransactionHistoryEntity>,

    @Inject(forwardRef(() => PaymentCommonService))
    private paymentCommonService: PaymentCommonService,

    private dataSource: DataSource,
    private driverService: DriversService,
    private eventGatewayService: EventGatewayService,
  ) {}

  createQueryBuilder(alias: string) {
    return this.transactionHistoryRepository.createQueryBuilder(alias);
  }

  async getPendingBalance(storeId: number) {
    const transactions = await this.transactionHistoryRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount + transaction.fee)', 'total')
      .where('transaction.storeId = :storeId', { storeId })
      .andWhere('transaction.status = :status', { status: ETransactionStatus.Pending })
      .getRawOne();

    return transactions.total || 0;
  }

  async withdraw(data: CreateWithdrawDto, driverId: number) {
    const { amount, accountType, accountName, pin } = data;
    const account = await this.paymentCommonService.checkAccount(data);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);
    const isNameMatch = compareText(account.account_name, accountName);
    if (!isNameMatch) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    const description = 'Rut tien';
    const invoiceNo = await this.createInvoiceNo(ETransactionType.Withdraw);

    return this.dataSource.transaction(async (manager) => {
      const driver = await manager.findOne(DriverEntity, { select: ['id', 'balance', 'pin'], where: { id: driverId } });
      if (!driver) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
      if (driver.pin && driver.pin !== pin) throw new BadRequestException(EXCEPTIONS.PIN_INCORRECT);
      if (driver.balance < amount) throw new BadRequestException(EXCEPTIONS.NOT_ENOUGH_BALANCE);

      const bank = await manager.findOne(BankEntity, { where: { code: ILike(data.bankCode) } });
      if (!bank) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

      // TODO: Calculate fee
      const fee = 0;
      const feeAmount = Math.floor((amount * fee) / 100);

      driver.balance = Number(driver.balance) - amount - feeAmount;
      await manager.save(driver);

      const newTransaction = new DriverTransactionHistoryEntity();
      newTransaction.amount = amount;
      newTransaction.description = description;
      newTransaction.invoiceNo = invoiceNo;
      newTransaction.driverId = driverId;
      newTransaction.type = ETransactionType.Withdraw;
      newTransaction.balance = driver.balance;
      newTransaction.fee = feeAmount;
      newTransaction.bankId = bank.id;
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
      }, 5000);

      return manager.save(newTransaction);
    });
  }

  private async createInvoiceNo(transactionType: ETransactionType, randomString?: string) {
    if (!randomString) randomString = generateRandomString(10, true);
    const prefixUserType = Object.values(EUserType).indexOf(EUserType.Driver);
    const prefixTransactionType = Object.values(ETransactionType).indexOf(transactionType);
    const invoiceNo = `${prefixUserType}${prefixTransactionType}${randomString}`;

    const checkInvoiceNo = await this.transactionHistoryRepository.existsBy({ invoiceNo });
    if (!checkInvoiceNo) return invoiceNo;

    return this.createInvoiceNo(transactionType);
  }

  async deposit(data: CreateDepositDto, driverId: number) {
    const { amount, returnUrl, method } = data;
    const description = 'Nạp tiền vào tài khoản';
    const invoiceNo = await this.createInvoiceNo(ETransactionType.Deposit);
    const balance = await this.driverService.getBalance(driverId);

    const newTransaction = new DriverTransactionHistoryEntity();
    newTransaction.amount = amount;
    newTransaction.description = description;
    newTransaction.invoiceNo = invoiceNo;
    newTransaction.driverId = driverId;
    newTransaction.type = ETransactionType.Deposit;
    newTransaction.balance = Number(balance) + amount;
    newTransaction.method = method;

    await this.transactionHistoryRepository.save(newTransaction);
    return this.paymentCommonService.createPaymentUrl({ amount, returnUrl, method, description, invoiceNo });
  }

  async updateTransactionStatus(invoiceNo: string, status: ETransactionStatus, result: IPaymentResult) {
    return this.dataSource.transaction(async (manager) => {
      const transaction = await manager.findOne(DriverTransactionHistoryEntity, {
        where: { invoiceNo, status: ETransactionStatus.Pending },
      });
      if (!transaction) return;

      const driver = await manager.findOne(DriverEntity, { where: { id: transaction.driverId } });
      const { id: driverId, balance } = driver;

      if (status === ETransactionStatus.Success) {
        transaction.status = status;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Deposit) {
          driver.balance = Number(balance) + Number(transaction.amount);
          await manager.save(driver);
        } else if (transaction.type === ETransactionType.Withdraw) {
        }
      } else if (status === ETransactionStatus.Failed) {
        transaction.status = status;
        transaction.errorMessage = result.failure_reason;
        transaction.transactionId = result.payment_no;

        if (transaction.type === ETransactionType.Withdraw) {
          driver.balance = Number(balance) + Number(transaction.amount) + Number(transaction.fee);
          await manager.save(driver);
          // this.notificationsService.sendWithdrawalFailed(transaction.storeId, transaction.amount, transaction.id);
        }
      }

      this.eventGatewayService.sendEventToUser(driverId, ERoleType.Driver, ESocketEvent.TransactionResult, {
        transaction,
      });
      await manager.save(transaction);
    });
  }
}
