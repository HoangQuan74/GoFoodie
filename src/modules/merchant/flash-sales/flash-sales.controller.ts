import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';

@Controller('flash-sales')
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  @Post()
  create(@Body() createFlashSaleDto: CreateFlashSaleDto) {
    return this.flashSalesService.create(createFlashSaleDto);
  }

  @Get()
  findAll() {
    return this.flashSalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashSalesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlashSaleDto: UpdateFlashSaleDto) {
    return this.flashSalesService.update(+id, updateFlashSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashSalesService.remove(+id);
  }
}
