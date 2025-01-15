import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends OmitType(PartialType(CreateCartDto), ['productId'] as const) {}
