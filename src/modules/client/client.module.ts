import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BannersModule } from './banners/banners.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/database/entities/client.entity';

@Module({
  imports: [
    BannersModule,
    RouterModule.register([{ path: 'client', module: BannersModule }]),
    AuthModule,
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
