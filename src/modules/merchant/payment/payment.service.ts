import { Injectable } from '@nestjs/common';
import { PaymentService as PaymentCommonService } from 'src/modules/payment/payment.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { Repository } from 'typeorm';
import { generateRandomString } from 'src/utils/bcrypt';
import { ETransactionType } from 'src/common/enums';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(StoreTransactionHistoryEntity)
    private readonly transactionHistoryRepository: Repository<StoreTransactionHistoryEntity>,

    private readonly paymentCommonService: PaymentCommonService,
    private readonly storeService: StoresService,
  ) {}

  async deposit(data: CreateDepositDto, storeId: number) {
    const { amount, returnUrl, method } = data;
    const description = 'Nạp tiền vào tài khoản';
    const invoiceNo = await this.createInvoiceNo();
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

  private async createInvoiceNo() {
    const invoiceNo = generateRandomString(30);

    const checkInvoiceNo = await this.transactionHistoryRepository.existsBy({ invoiceNo });
    if (!checkInvoiceNo) return invoiceNo;

    return this.createInvoiceNo();
  }
}
