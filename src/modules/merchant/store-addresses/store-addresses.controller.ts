import { Controller, Get, Body, Param, UseGuards, Put } from '@nestjs/common';
import { StoreAddressesService } from './store-addresses.service';
import { UpdateStoreAddressDto } from './dto/update-store-address.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { StoresService } from '../stores/stores.service';

@Controller('store-addresses')
@ApiTags('Merchant Store Addresses')
@UseGuards(AuthGuard)
export class StoreAddressesController {
  constructor(
    private readonly storeAddressesService: StoreAddressesService,
    private readonly storeService: StoresService,
  ) {}

  @Get()
  async find(@CurrentStore() storeId: number) {
    return this.storeAddressesService.find({
      select: { store: { name: true, phoneNumber: true } },
      where: { storeId },
      relations: ['store'],
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentStore() storeId: number) {
    return this.storeAddressesService.findOne({
      select: { store: { name: true, phoneNumber: true } },
      where: { storeId, id: +id },
      relations: ['store'],
    });
  }

  @Put()
  async update(@Body() body: UpdateStoreAddressDto, @CurrentStore() storeId: number) {
    const { type } = body;
    const address = await this.storeAddressesService.findOne({ where: { storeId, type } });
    if (!address) return this.storeAddressesService.save({ ...body, storeId });

    return this.storeAddressesService.save({ ...address, ...body });
  }
}
