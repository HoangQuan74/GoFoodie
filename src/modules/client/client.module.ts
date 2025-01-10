import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BannersModule } from './banners/banners.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/database/entities/client.entity';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [
    BannersModule,
    RouterModule.register([
      { path: 'client', module: BannersModule },
      { path: 'client', module: StoresModule },
      { path: 'client', module: AuthModule },
      { path: 'client', module: AddressesModule },
    ]),
    AuthModule,
    TypeOrmModule.forFeature([ClientEntity]),
    StoresModule,
    ProductsModule,
    ProductCategoriesModule,
    AddressesModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
