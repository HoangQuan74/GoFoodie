import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { QueryOptionGroupDto } from './dto/query-option-group.dto';
import { FindManyOptions, ILike, Not } from 'typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProductOptionGroupEntity } from 'src/database/entities/product-option-group.entity';
import { ProductOptionGroupsService } from 'src/modules/product-option-groups/product-option-groups.service';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';

@Controller('option-groups')
@ApiTags('Nhóm tùy chọn (Topping)')
@UseGuards(AuthGuard)
export class OptionGroupsController {
  constructor(
    private readonly optionGroupsService: OptionGroupsService,
    private readonly productOptionGroupsService: ProductOptionGroupsService,
  ) {}

  @Post()
  async create(@Body() createOptionGroupDto: CreateOptionGroupDto, @CurrentStore() storeId: number) {
    const { name } = createOptionGroupDto;
    const { products = [], ...rest } = createOptionGroupDto;

    const isExist = await this.optionGroupsService.findOne({ where: { name, storeId } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    const optionGroup = await this.optionGroupsService.save({ ...rest, storeId });

    const productOptionGroups = products.map((product) => {
      const productOptionGroup = new ProductOptionGroupEntity();
      productOptionGroup.productId = product.id;
      productOptionGroup.optionGroupId = optionGroup.id;
      productOptionGroup.options = optionGroup.options;
      return productOptionGroup;
    });

    await this.productOptionGroupsService.save(productOptionGroups);
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

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOptionGroupDto: UpdateOptionGroupDto,
    @CurrentStore() storeId: number,
  ) {
    const { products = [], ...rest } = updateOptionGroupDto;

    const isExist = await this.optionGroupsService.count({
      where: { name: rest.name, id: Not(id), storeId },
    });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    let optionGroup = await this.optionGroupsService.findOne({ where: { id }, relations: ['options'] });
    if (!optionGroup) throw new NotFoundException();

    optionGroup = await this.optionGroupsService.save({ ...optionGroup, ...rest });

    const productOptionGroups = products.map((product) => {
      const productOptionGroup = new ProductOptionGroupEntity();
      productOptionGroup.productId = product.id;
      productOptionGroup.optionGroupId = id;
      productOptionGroup.options = optionGroup.options;
      return productOptionGroup;
    });

    await this.productOptionGroupsService.removeAllProduct(id);
    await this.productOptionGroupsService.save(productOptionGroups);
    return optionGroup;
  }
}
