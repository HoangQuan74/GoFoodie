import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('addresses')
@ApiTags('Địa chỉ')
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @CurrentUser() user: JwtPayload) {
    return this.addressesService.save({ ...createAddressDto, clientId: user.id });
  }

  @Get()
  find(@CurrentUser() user: JwtPayload) {
    return this.addressesService.find({ where: { clientId: user.id }, order: { id: 'DESC' } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @CurrentUser() user: JwtPayload) {
    const address = await this.addressesService.findOne({ where: { id: +id, clientId: user.id } });
    if (!address) throw new NotFoundException();

    return this.addressesService.save({ ...address, ...updateAddressDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const address = await this.addressesService.findOne({ where: { id: +id, clientId: user.id } });
    if (!address) throw new NotFoundException();

    return this.addressesService.remove(address);
  }

  @Patch(':id/set-default')
  async setDefaultAddress(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const address = await this.addressesService.findOne({ where: { id: +id, clientId: user.id } });
    if (!address) throw new NotFoundException();

    await this.addressesService.update({ clientId: user.id }, { isDefault: false });
    return this.addressesService.save({ ...address, isDefault: true });
  }
}
