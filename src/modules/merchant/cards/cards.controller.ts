import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ECardType } from 'src/common/enums';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @CurrentStore() storeId: number) {
    return this.cardsService.save({ ...createCardDto, storeId });
  }

  @Get()
  find(@CurrentUser() user: JwtPayload, @CurrentStore() storeId: number, @Query('type') type: ECardType) {
    const where = type ? { storeId, type } : { storeId };

    return this.cardsService.find({
      select: ['id', 'cardNumber', 'cardHolder', 'expiryDate'],
      where,
      relations: ['bank'],
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentStore() storeId: number) {
    const card = await this.cardsService.findOne({ where: { id: +id, storeId } });
    if (!card) throw new NotFoundException();

    return card;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const card = await this.cardsService.findOne({ where: { id: +id } });
    if (!card) throw new NotFoundException();

    return this.cardsService.save({ ...card, ...updateCardDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const card = await this.cardsService.findOne({ where: { id: +id } });
    if (!card) throw new NotFoundException();

    return this.cardsService.remove(card);
  }
}
