import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '../auth/auth.guard';
import { BANNER_TYPES, BANNER_DISPLAY_TYPES } from 'src/common/constants';
import { ApiTags } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';

@Controller('banners')
@ApiTags('Banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get('types')
  getTypes() {
    return BANNER_TYPES;
  }

  @Get('display-types')
  getDisplayTypes() {
    return BANNER_DISPLAY_TYPES;
  }

  @Post()
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.save(createBannerDto);
  }

  @Get()
  find() {
    return this.bannersService.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { images: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return banner;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
  //   return this.bannersService.update(+id, updateBannerDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { images: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return this.bannersService.remove(banner);
  }
}
