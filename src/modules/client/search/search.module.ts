import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductView } from 'src/database/views/product.view';
import { StoreView } from 'src/database/views/store.view';

@Module({
  imports: [TypeOrmModule.forFeature([ProductView, StoreView])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
