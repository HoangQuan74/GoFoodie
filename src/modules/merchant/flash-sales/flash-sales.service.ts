import { Injectable } from '@nestjs/common';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';

@Injectable()
export class FlashSalesService {
  create(createFlashSaleDto: CreateFlashSaleDto) {
    return 'This action adds a new flashSale';
  }

  findAll() {
    return `This action returns all flashSales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashSale`;
  }

  update(id: number, updateFlashSaleDto: UpdateFlashSaleDto) {
    return `This action updates a #${id} flashSale`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashSale`;
  }
}
