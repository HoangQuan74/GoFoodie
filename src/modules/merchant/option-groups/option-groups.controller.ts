import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { QueryOptionGroupDto } from './dto/query-option-group.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('option-groups')
@ApiTags('Nhóm tùy chọn (Topping)')
@UseGuards(AuthGuard)
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}

  @Post()
  async create(@Body() createOptionGroupDto: CreateOptionGroupDto, @CurrentStore() storeId: number) {
    const { name } = createOptionGroupDto;
    // const { products = [], ...rest } = createOptionGroupDto;

    const isExist = await this.optionGroupsService.findOne({ where: { name, storeId } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    const optionGroup = await this.optionGroupsService.save({ ...createOptionGroupDto, storeId });

    // const productOptionGroups = products.map((product) => {
    //   const productOptionGroup = new ProductOptionGroupEntity();
    //   productOptionGroup.productId = product.id;
    //   productOptionGroup.optionGroupId = optionGroup.id;
    //   productOptionGroup.options = optionGroup.options;
    //   return productOptionGroup;
    // });

    // await this.productOptionGroupsService.save(productOptionGroups);
    return optionGroup;
  }

  @Get()
  async find(@Query() query: QueryOptionGroupDto, @CurrentStore() storeId: number) {
    const { limit, page, search, status } = query;
    const where = { storeId };
    status && (where['status'] = status);
    search && (where['name'] = ILike(`%${search}%`));

    const options: FindManyOptions<OptionGroupEntity> = {
      select: { options: { id: true, name: true } },
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['options'],
      order: { id: 'DESC' },
    };
    const [items, total] = await this.optionGroupsService.findAndCount(options);
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentStore() storeId: number) {
    const optionGroup = await this.optionGroupsService.findOne({
      where: { id, storeId },
      relations: { options: true },
    });
    if (!optionGroup) throw new NotFoundException();

    return optionGroup;
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @CurrentStore() storeId: number) {
    const optionGroup = await this.optionGroupsService.findOne({
      where: { id, storeId },
      relations: ['productOptionGroups'],
    });
    if (!optionGroup) throw new NotFoundException();

    return this.optionGroupsService.remove(optionGroup);
  }
}
