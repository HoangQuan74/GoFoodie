import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { EOptionGroupStatus, EOptionStatus, EProductStatus } from 'src/common/enums';
import { isEmpty } from 'lodash';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,

    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,
  ) {}

  async save(entity: DeepPartial<CartEntity>) {
    return this.cartRepository.save(entity);
  }

  async findOne(options: FindOneOptions<CartEntity>) {
    return this.cartRepository.findOne(options);
  }

  async find(options?: FindManyOptions<CartEntity>) {
    return this.cartRepository.find(options);
  }

  async remove(entity: CartEntity) {
    return this.cartRepository.remove(entity);
  }

  createQueryBuilder(alias?: string) {
    return this.cartRepository.createQueryBuilder(alias);
  }

  async addProductToCart(cart: CartEntity, data: CreateCartDto) {
    const { productId, quantity, optionIds, note } = data;
    const cartProductOptions = optionIds.map((optionId) => {
      const cartProductOption = new CartProductOptionEntity();
      cartProductOption.optionId = optionId;
      return cartProductOption;
    });

    const cartProduct = new CartProductEntity();
    cartProduct.cartId = cart.id;
    cartProduct.productId = productId;
    cartProduct.quantity = quantity;
    cartProduct.note = note;
    cartProduct.cartProductOptions = cartProductOptions;

    return this.cartProductRepository.save(cartProduct);
  }

  async removeCartProduct(cartProduct: CartProductEntity) {
    await this.cartProductRepository.remove(cartProduct);
  }

  async saveCartProduct(cartProduct: CartProductEntity) {
    await this.cartProductRepository.save(cartProduct);
  }

  async removeCartProductsByStoreId(storeId: number) {
    const cartProducts = await this.cartProductRepository.find({
      where: { cart: { storeId } },
      relations: ['cartProductOptions'],
    });

    await this.cartProductRepository.remove(cartProducts);
  }

  async validateCart(cartId: number) {
    const cart = await this.cartRepository.findOne({
      select: {
        id: true,
        cartProducts: {
          id: true,
          quantity: true,
          product: {
            id: true,
            name: true,
            status: true,
            productOptionGroups: {
              id: true,
              optionGroup: { id: true, isMultiple: true, status: true },
              options: { id: true, status: true },
            },
          },
        },
      },
      where: { id: cartId },
      relations: {
        cartProducts: {
          product: { productOptionGroups: { options: true, optionGroup: true } },
          cartProductOptions: true,
        },
      },
    });
    if (!cart) return;

    const changedProducts = [];
    const cartProducts = cart.cartProducts;
    for (const cartProduct of cartProducts) {
      // Remove cart product if quantity is less than or equal to 0 or product is not active
      if (cartProduct.quantity <= 0 || cartProduct.product.status !== EProductStatus.Active) {
        changedProducts.push({ ...cartProduct.product, quantity: cartProduct.quantity });
        await this.removeCartProduct(cartProduct);
        continue;
      }

      const { cartProductOptions = [] } = cartProduct;
      const { productOptionGroups } = cartProduct.product;

      for (const productOptionGroup of productOptionGroups) {
        const { isMultiple, status } = productOptionGroup.optionGroup;
        const options = productOptionGroup.options.filter((option) => option.status === EOptionStatus.Active);

        if (isEmpty(options)) continue;

        const optionIds = options.map((option) => option.id);

        // Remove cart product if option group is not multiple and not all options are selected
        if (!isMultiple && status === EOptionGroupStatus.Active) {
          const selectedOptionIds = cartProductOptions.map((cpo) => cpo.optionId);
          // chọn ít nhất 1 option trong group
          if (!optionIds.some((optionId) => selectedOptionIds.includes(optionId))) {
            changedProducts.push({ ...cartProduct.product, quantity: cartProduct.quantity });
            await this.removeCartProduct(cartProduct);
            break;
          }
        }
      }
    }

    return changedProducts;
  }

  async getCartValue(cartId: number) {
    const cart = await this.cartRepository.findOne({
      select: {
        id: true,
        storeId: true,
        cartProducts: {
          id: true,
          quantity: true,
          product: { id: true, price: true },
          cartProductOptions: { cartProductId: true, optionId: true, option: { price: true, status: true } },
        },
      },
      where: { id: cartId },
      relations: { cartProducts: { product: true, cartProductOptions: { option: true } } },
    });

    if (!cart) return { total: 0, storeId: null, productIds: [] };

    let total = 0;
    const productIds = new Set();
    for (const cartProduct of cart.cartProducts) {
      let productPrice = cartProduct.product.price;
      productIds.add(cartProduct.productId);
      for (const cartProductOption of cartProduct.cartProductOptions) {
        if (cartProductOption.option.status === EOptionStatus.Active) {
          productPrice += cartProductOption.option.price;
        }
      }
      total += productPrice * cartProduct.quantity;
    }

    return { total, storeId: cart.storeId, productIds: Array.from(productIds) };
  }
}
