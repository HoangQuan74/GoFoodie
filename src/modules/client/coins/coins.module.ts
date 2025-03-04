import { forwardRef, Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { ClientCoinHistoryEntity } from 'src/database/entities/client-coin-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../clients/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientCoinHistoryEntity]), forwardRef(() => ClientModule)],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
