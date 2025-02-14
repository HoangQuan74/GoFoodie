import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EOrderProcessor } from 'src/common/enums/order.enum';
import { OrderService } from '../merchant/order/order.service';

@Processor('orderQueue')
export class OrderProcessor extends WorkerHost {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case EOrderProcessor.CANCEL_ORDER:
        // return this.cancelOrder(job);
        break;
    }
  }
}
