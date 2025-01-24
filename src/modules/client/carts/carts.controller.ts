import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';
import { EOptionGroupStatus, EOptionStatus, EProductApprovalStatus, EProductStatus } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';

@Controller('carts')
@ApiTags('Client Carts')
@UseGuards(AuthGuard)
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  async create(@Body() body: CreateCartDto, @CurrentUser() user: JwtPayload) {
    const { productId, optionIds, quantity, note } = body;
    const { id: clientId } = user;

    const product = await this.productsService.findOne({
      select: ['id', 'price', 'storeId', 'name'],
      where: { id: productId, status: EProductStatus.Active, approvalStatus: EProductApprovalStatus.Approved },
    });
    if (!product) throw new NotFoundException();

    let cart = await this.cartsService.findOne({
      where: { storeId: product.storeId, clientId },
      relations: ['cartProducts', 'cartProducts.cartProductOptions'],
    });

    if (cart) {
      const cartProduct = cart.cartProducts.find((cp) => cp.productId === productId);
      if (cartProduct) {
        const cartProductOptionIds = cartProduct.cartProductOptions.map((cpo) => cpo.optionId);
        const optionIdsSet = new Set(optionIds);

        if (optionIdsSet.size !== cartProductOptionIds.length) {
          return this.cartsService.addProductToCart(cart, body);
        }

        for (const optionId of optionIds) {
          if (!cartProductOptionIds.includes(optionId)) {
            return this.cartsService.addProductToCart(cart, body);
          }
        }

        cartProduct.quantity += quantity;
        cartProduct.note = note;
        return this.cartsService.saveCartProduct(cartProduct);
      }

      return this.cartsService.addProductToCart(cart, body);
    }

    cart = await this.cartsService.save({ clientId, storeId: product.storeId });
    return this.cartsService.addProductToCart(cart, body);
  }

  @Get()
  async find(@CurrentUser() user: JwtPayload) {
    const carts = await this.cartsService
      .createQueryBuilder('cart')
      .select([
        'cart.id as id',
        'store.id as "storeId"',
        'store.name as "storeName"',
        'store.storeAvatarId as "storeAvatarId"',
        'store.specialDish as "specialDish"',
        'store.streetName as "streetName"',
        'store.latitude as "latitude"',
        'store.longitude as "longitude"',
      ])
      .addSelect('SUM(cartProducts.quantity)', 'totalQuantity')
      .addSelect('COUNT(cartProducts.id)', 'totalItems')
      .addSelect(`SUM((product.price + COALESCE(option."totalOptionPrice", 0)) * cartProducts.quantity)`, 'totalPrice')
      .addSelect('0', 'averageRating')
      .innerJoin('cart.cartProducts', 'cartProducts')
      .leftJoin(
        (qb) =>
          qb
            .select('cartProductOptions.cartProductId', 'cartProductId')
            .addSelect('SUM(option.price)', 'totalOptionPrice')
            .from(CartProductOptionEntity, 'cartProductOptions')
            .innerJoin('cartProductOptions.option', 'option')
            .groupBy('cartProductOptions.cartProductId'),
        'option',
        'option."cartProductId" = cartProducts.id',
      )
      .innerJoin('cartProducts.product', 'product')
      .innerJoin('cart.store', 'store')
      .where('cart.clientId = :clientId', { clientId: user.id })
      .groupBy('cart.id, store.id')
      .getRawMany();

    return carts;
  }

  @Get('store/:storeId')
  async findByStore(@Param('storeId') storeId: string, @CurrentUser() user: JwtPayload) {
    const cart = await this.cartsService
      .createQueryBuilder('cart')
      .addSelect(['product.id', 'product.name', 'product.price', 'product.imageId'])
      .leftJoinAndSelect('cart.cartProducts', 'cartProducts')
      .leftJoin('cartProducts.product', 'product')
      .leftJoinAndSelect('cartProducts.cartProductOptions', 'cartProductOptions')
      .leftJoinAndSelect('cartProductOptions.option', 'option', 'option.status = :optionStatus')
      .leftJoinAndSelect('option.optionGroup', 'optionGroup', 'optionGroup.status = :optionGroupStatus')
      .setParameter('optionStatus', EOptionStatus.Active)
      .setParameter('optionGroupStatus', EOptionGroupStatus.Active)
      .where('cart.clientId = :clientId', { clientId: user.id })
      .andWhere('cart.storeId = :storeId', { storeId: +storeId })
      .orderBy('cartProducts.id', 'ASC')
      .getOne();

    const { cartProducts = [] } = cart;

    cartProducts.forEach((cp: any) => {
      const options = cp.cartProductOptions.map((cpo) => cpo.option).filter((option) => option?.optionGroup);
      const groupedOptions = _.groupBy(options, 'optionGroupId');

      cp.cartProductOptions = Object.keys(groupedOptions).map((key) => ({
        optionGroup: groupedOptions[key][0].optionGroup,
        options: groupedOptions[key].map((option) => _.omit(option, ['optionGroup'])),
      }));
    });

    return cartProducts;
  }

  @Patch('cart-products/:id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @CurrentUser() user: JwtPayload) {
    const cart = await this.cartsService.findOne({
      where: { clientId: user.id, cartProducts: { id: +id } },
      relations: ['cartProducts', 'cartProducts.cartProductOptions'],
    });
    if (!cart) throw new NotFoundException();

    const cartProduct = cart.cartProducts.find((cp) => cp.id === +id);
    if (!cartProduct) throw new NotFoundException();

    const { optionIds } = updateCartDto;

    if (optionIds) {
      const cartProductOptions = optionIds.map((optionId) => {
        const cartProductOption = new CartProductOptionEntity();
        cartProductOption.optionId = optionId;
        return cartProductOption;
      });
      cartProduct.cartProductOptions = cartProductOptions;
    }
    Object.assign(cartProduct, updateCartDto);

    return this.cartsService.saveCartProduct(cartProduct);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const cart = await this.cartsService.findOne({
      where: { id: +id, clientId: user.id },
      relations: ['cartProducts', 'cartProducts.cartProductOptions'],
    });
    if (!cart) throw new NotFoundException();

    return this.cartsService.remove(cart);
  }

  @Delete('cart-products/:cartProductId')
  async removeProduct(@Param('cartProductId') cartProductId: string, @CurrentUser() user: JwtPayload) {
    const cart = await this.cartsService.findOne({
      where: { clientId: user.id, cartProducts: { id: +cartProductId } },
      relations: ['cartProducts', 'cartProducts.cartProductOptions'],
    });
    if (!cart) throw new NotFoundException();

    const cartProduct = cart.cartProducts.find((cp) => cp.id === +cartProductId);
    if (!cartProduct) throw new NotFoundException();

    return this.cartsService.removeCartProduct(cartProduct);
  }
}
