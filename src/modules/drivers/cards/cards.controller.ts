import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ECardType } from 'src/common/enums';

@Controller('cards')
@ApiTags('Cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @CurrentUser() user: JwtPayload) {
    return this.cardsService.save({ ...createCardDto, driverId: user.id });
  }

  @Get()
  find(@CurrentUser() user: JwtPayload, @Query('type') type: ECardType) {
    const options = type ? { where: { driverId: user.id, type } } : { where: { driverId: user.id } };
    return this.cardsService.find(options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const card = await this.cardsService.findOne({ where: { id: +id, driverId: user.id } });
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
