import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends OmitType(PartialType(CreateStoreDto), ['isDraft'] as const) {}
