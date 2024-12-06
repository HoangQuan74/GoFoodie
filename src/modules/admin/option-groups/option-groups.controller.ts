import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { CreateOptionGroupDto } from './dto/create-option-group.dto';
import { UpdateOptionGroupDto } from './dto/update-option-group.dto';
import { QueryOptionGroupDto } from './dto/query-option-group.dto';
import { FindManyOptions, ILike, Not } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { ProductOptionGroupEntity } from 'src/database/entities/product-option-group.entity';
import { ProductOptionGroupsService } from 'src/modules/product-option-groups/product-option-groups.service';
import { EXCEPTIONS } from 'src/common/constants';

@Controller('option-groups')
@ApiTags('Quản lý nhóm tùy chọn sản phẩm')
export class OptionGroupsController {
  constructor(
    private readonly optionGroupsService: OptionGroupsService,
    private readonly productOptionGroupsService: ProductOptionGroupsService,
  ) {}

  @Post()
  async create(@Body() createOptionGroupDto: CreateOptionGroupDto) {
    const { name, storeId } = createOptionGroupDto;
    const isExist = await this.optionGroupsService.findOne({ where: { name, storeId } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    return this.optionGroupsService.save(createOptionGroupDto);
  }

  @Get()
  async find(@Query() query: QueryOptionGroupDto) {
    const { limit, page, search, status, storeId } = query;
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
  async findOne(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({
      select: { products: { id: true, name: true } },
      where: { id },
      relations: {
        options: true,
        products: true,
      },
    });
    if (!optionGroup) throw new NotFoundException();

    return optionGroup;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateOptionGroupDto: UpdateOptionGroupDto) {
    const { products = [], ...rest } = updateOptionGroupDto;

    const isExist = await this.optionGroupsService.count({
      where: { name: rest.name, id: Not(id), storeId: rest.storeId },
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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const optionGroup = await this.optionGroupsService.findOne({ where: { id }, relations: ['productOptionGroups'] });
    if (!optionGroup) throw new NotFoundException();

    return this.optionGroupsService.remove(optionGroup);
  }
}
