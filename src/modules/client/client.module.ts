import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BannersModule } from './banners/banners.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BannersModule, RouterModule.register([{ path: 'client', module: BannersModule }]), AuthModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
