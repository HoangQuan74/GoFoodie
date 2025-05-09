import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  ConflictException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { StoreEntity } from 'src/database/entities/store.entity';
import { DataSource, In, Like } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { OptionEntity } from 'src/database/entities/option.entity';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { ENotificationType, EProductApprovalStatus, ERequestType, EUserType } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryProductDto } from './dto/query-product.dto';
import { OptionGroupsService } from '../option-groups/option-groups.service';
import { EXCEPTIONS } from 'src/common/constants';
import { AdminNotificationEntity } from 'src/database/entities/admin-notification.entity';
import { APPROVE_PATH } from 'src/common/constants/common.constant';
import { NotificationsService } from 'src/modules/admin/notifications/notifications.service';
import { EventGatewayService } from 'src/events/event.gateway.service';

@Controller('products')
@ApiTags('Products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
    private readonly optionGroupsService: OptionGroupsService,
    private readonly notificationService: NotificationsService,
    private readonly eventGatewayService: EventGatewayService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm (món ăn)' })
  create(@Body() createProductDto: CreateProductDto, @CurrentStore() storeId: number, @CurrentUser() user: JwtPayload) {
    const { id: merchantId } = user;

    return this.dataSource.transaction(async (manager) => {
      const { optionIds = [], name } = createProductDto;
      const store = await manager.findOne(StoreEntity, { where: { id: storeId } });
      if (!store) throw new NotFoundException();

      const isExist = await manager.findOne(ProductEntity, { where: { name, storeId } });
      if (isExist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);

      const lastProduct = await manager.findOne(ProductEntity, {
        where: { storeId },
        order: { code: 'DESC' },
        withDeleted: true,
      });
      const numberProduct = lastProduct ? +lastProduct.code.slice(-3) + 1 : 1;
      const productCode = `${store.storeCode}${numberProduct.toString().padStart(3, '0')}`;

      const newProduct = new ProductEntity();
      Object.assign(newProduct, createProductDto);
      newProduct.storeId = storeId;
      newProduct.code = productCode;
      newProduct.approvalStatus = EProductApprovalStatus.Pending;
      const productOptionGroups = [];

      if (optionIds.length) {
        const options = await manager.find(OptionEntity, { where: { id: In(optionIds) } });
        if (options.length !== optionIds.length) throw new NotFoundException();

        options.forEach((option) => {
          const isExist = productOptionGroups.find((item) => item.optionGroupId === option.optionGroupId);
          if (isExist) {
            isExist.options.push(option);
          } else {
            productOptionGroups.push({ optionGroupId: option.optionGroupId, options: [option] });
          }
        });
      }

      newProduct.productOptionGroups = productOptionGroups;
      const product = await manager.save(newProduct);

      const lastProductApproval = await manager.findOne(ProductApprovalEntity, {
        where: { code: Like(`${store.storeCode}-%`) },
        order: { id: 'DESC' },
        withDeleted: true,
      });
      const numberApproval = lastProductApproval ? +lastProductApproval.code.split('-')[1] + 1 : 1;
      const approvalCode = `${store.storeCode}-${numberApproval.toString().padStart(2, '0')}`;

      const productApproval = new ProductApprovalEntity();
      productApproval.code = approvalCode;
      productApproval.productId = product.id;
      productApproval.type = ERequestType.Create;
      productApproval.merchantId = merchantId;
      const request = await manager.save(productApproval);

      const newNotification = new AdminNotificationEntity();
      newNotification.imageId = product.imageId;
      newNotification.from = store.name;
      newNotification.userType = EUserType.Merchant;
      newNotification.path = APPROVE_PATH.requestProduct(request.id);
      newNotification.type = ENotificationType.ProductCreate;
      newNotification.relatedId = product.id;
      newNotification.provinceId = store.provinceId;
      this.eventGatewayService.handleNewNotification();
      await manager.save(newNotification);

      return product;
    });
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm (món ăn)' })
  async find(@Query() query: QueryProductDto, @CurrentStore() storeId: number) {
    const { status, approvalStatus, productCategoryId, limit, page, search } = query;

    const queryBuilder = this.productsService
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.status',
        'product.createdAt',
        'product.imageId',
        'product.approvalStatus',
        'product.reason',
      ])
      .where({ storeId })
      .orderBy('product.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    search && queryBuilder.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('product.status = :status', { status });
    approvalStatus && queryBuilder.andWhere('product.approvalStatus = :approvalStatus', { approvalStatus });
    productCategoryId && queryBuilder.andWhere('product.productCategoryId = :productCategoryId', { productCategoryId });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm (món ăn)' })
  async findOne(@Param('id') id: string, @CurrentStore() storeId: number) {
    const product = await this.productsService.findOne({
      select: { productOptionGroups: true, productWorkingTimes: true, productCategory: { id: true, name: true } },
      where: { id: +id, storeId },
      relations: {
        productOptionGroups: { options: true, optionGroup: true },
        productWorkingTimes: true,
        productCategory: true,
      },
    });
    if (!product) throw new NotFoundException();

    return product;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm (món ăn)' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentStore() storeId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const { optionIds = [], name, description, imageId, ...rest } = updateProductDto;
    const product = await this.productsService.findOne({
      select: { store: { id: true, storeCode: true, provinceId: true, name: true } },
      where: { id: +id, storeId },
      relations: ['store'],
    });

    if (product.approvalStatus === EProductApprovalStatus.Rejected) {
      product.approvalStatus = EProductApprovalStatus.Pending;
    }

    if (!product) throw new NotFoundException();

    let isNeedApproval = false;
    product.approvalStatus !== EProductApprovalStatus.Approved && (isNeedApproval = true);
    name && name !== product.name && (isNeedApproval = true);
    description && description !== product.description && (isNeedApproval = true);
    imageId && imageId !== product.imageId && (isNeedApproval = true);

    if (isNeedApproval) {
      const lastProductApproval = await this.productsService.findOneProductApproval({
        where: { code: Like(`${product.store.storeCode}-%`) },
        order: { id: 'DESC' },
        withDeleted: true,
      });

      const numberApproval = lastProductApproval ? +lastProductApproval.code.split('-')[1] + 1 : 1;
      const approvalCode = `${product.store.storeCode}-${numberApproval.toString().padStart(2, '0')}`;

      const productApproval = new ProductApprovalEntity();
      const newNotification = new AdminNotificationEntity();

      productApproval.code = approvalCode;
      productApproval.productId = +id;
      productApproval.merchantId = user.id;
      productApproval.name = name || product.name;
      productApproval.description = description;
      productApproval.imageId = imageId;

      if (product.approvalStatus === EProductApprovalStatus.Approved) {
        Object.assign(product, rest);
        productApproval.type = ERequestType.Update;
        newNotification.type = ENotificationType.ProductUpdate;
      } else {
        Object.assign(product, updateProductDto);
        productApproval.type = ERequestType.Create;
        newNotification.type = ENotificationType.ProductCreate;
      }

      const request = await this.productsService.saveProductApproval(productApproval);

      newNotification.imageId = product.imageId;
      newNotification.from = product.store.name;
      newNotification.userType = EUserType.Merchant;
      newNotification.path = APPROVE_PATH.requestProduct(request.id);
      newNotification.relatedId = product.id;
      newNotification.provinceId = product.store.provinceId;
      await this.notificationService.save(newNotification);
    } else {
      Object.assign(product, updateProductDto);
    }

    const productOptionGroups = [];
    if (optionIds.length) {
      const options = await this.optionGroupsService.findOptions({ where: { id: In(optionIds) } });
      if (options.length !== optionIds.length) throw new NotFoundException();

      options.forEach((option) => {
        const isExist = productOptionGroups.find((item) => item.optionGroupId === option.optionGroupId);
        if (isExist) {
          isExist.options.push(option);
        } else {
          productOptionGroups.push({ optionGroupId: option.optionGroupId, options: [option] });
        }
      });

      product.productOptionGroups = productOptionGroups;
    }

    return this.productsService.save(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm (món ăn)' })
  async remove(@Param('id') id: string, @CurrentStore() storeId: number) {
    const product = await this.productsService.findOne({
      where: { id: +id, storeId },
      relations: ['productWorkingTimes'],
    });
    if (!product) throw new NotFoundException();

    return this.productsService.remove(product);
  }
}
