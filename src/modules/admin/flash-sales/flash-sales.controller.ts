import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('flash-sales')
@ApiTags('Admin Flash Sales')
@UseGuards(AuthGuard)
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  @Post()
  create(@Body() body: CreateFlashSaleDto) {
    return this.flashSalesService.save(body);
  }

  @Get('time-frames')
  @ApiOperation({ summary: 'Lấy danh sách khung giờ flash sale' })
  getTimeFrames() {
    return this.flashSalesService.getTimeFrames({ order: { startTime: 'ASC' } });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const flashSale = await this.flashSalesService.findOne({ where: { id: +id } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.remove(flashSale);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateFlashSaleDto) {
    const flashSale = await this.flashSalesService.findOne({ where: { id: +id } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.save({ ...flashSale, ...body });
  }

  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return { items: [], total: 0 };
  }
}
