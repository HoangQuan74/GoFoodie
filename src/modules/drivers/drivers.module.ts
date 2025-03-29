import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { UniformsModule } from './uniforms/uniforms.module';
import { OnlineTrainingsModule } from './online-trainings/online-trainings.module';
import { BannersModule } from './banners/banners.module';
import { WorkingSessionsModule } from './working-sessions/working-sessions.module';
import { CancelOrderReasonsModule } from './cancel-order-reasons/cancel-order-reasons.module';
import { OrdersModule } from './order/order.module';
import { BanksModule } from './banks/banks.module';
import { CardsModule } from './cards/cards.module';
import { IncomeModule } from './income/income.module';
import { RequestsModule } from './requests/requests.module';
import { OrderGroupModule } from './order-group/order-group.module';
import { PaymentModule } from './payment/payment.module';
import { FeeModule } from './fee/fee.module';

@Module({
  imports: [
    AuthModule,
    UniformsModule,
    TypeOrmModule.forFeature([DriverEntity]),
    RouterModule.register([
      { path: 'driver', module: AuthModule },
      { path: 'driver', module: OnlineTrainingsModule },
      { path: 'driver', module: BannersModule },
      { path: 'driver', module: WorkingSessionsModule },
      { path: 'driver', module: CancelOrderReasonsModule },
      { path: 'driver', module: OrdersModule },
      { path: 'driver', module: BanksModule },
      { path: 'driver', module: CardsModule },
      { path: 'driver', module: IncomeModule },
      { path: 'driver', module: RequestsModule },
      { path: 'driver', module: OrderGroupModule },
      { path: 'driver', module: PaymentModule },
      { path: 'driver', module: FeeModule },
    ]),
    OnlineTrainingsModule,
    BannersModule,
    WorkingSessionsModule,
    CancelOrderReasonsModule,
    OrdersModule,
    BanksModule,
    CardsModule,
    IncomeModule,
    RequestsModule,
    OrderGroupModule,
    PaymentModule,
    FeeModule,
  ],
})
export class DriversModule {}
