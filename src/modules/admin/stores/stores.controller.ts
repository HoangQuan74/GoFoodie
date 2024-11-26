import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { QueryStoreDto } from './dto/query-store.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoreEntity } from 'src/database/entities/store.entity';

@Controller('stores')
@ApiTags('Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(@Body() body: CreateStoreDto) {
    const newStore = new StoreEntity();
    Object.assign(newStore, body);
    console.log(newStore);
    return this.storesService.save(newStore);
  }

  @Get()
  async find(@Query() query: QueryStoreDto) {
    const { search, page, limit, sort } = query;

    const queryBuilder = this.storesService.createQueryBuilder('store');

    if (search) {
      queryBuilder.andWhere('store.name ILIKE :search', { search: `%${search}%` });
    }

    if (sort) {
      const [column, order] = sort.split(':') as [string, 'ASC' | 'DESC'];
      queryBuilder.orderBy(`store.${column}`, order);
    }

    queryBuilder.skip((page - 1) * limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }
}
