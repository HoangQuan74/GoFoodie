import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

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
    cartProduct.cart = cart;
    cartProduct.productId = productId;
    cartProduct.quantity = quantity;
    cartProduct.note = note;
    cartProduct.cartProductOptions = cartProductOptions;

    !cart.cartProducts && (cart.cartProducts = []);
    cart.cartProducts.push(cartProduct);
    await this.save(cart);
  }

  async removeCartProduct(cartProduct: CartProductEntity) {
    await this.cartProductRepository.remove(cartProduct);
  }

  async saveCartProduct(cartProduct: CartProductEntity) {
    await this.cartProductRepository.save(cartProduct);
  }
}
