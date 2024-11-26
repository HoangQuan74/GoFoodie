import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from 'src/database/entities/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
