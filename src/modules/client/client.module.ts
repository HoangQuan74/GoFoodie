import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BannersModule } from './banners/banners.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [BannersModule, RouterModule.register([{ path: 'client', module: BannersModule }])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
