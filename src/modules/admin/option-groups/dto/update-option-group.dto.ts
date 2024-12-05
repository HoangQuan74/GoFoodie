import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOptionGroupDto } from './create-option-group.dto';
import { IsInt } from 'class-validator';

export class UpdateOptionGroupDto extends PartialType(CreateOptionGroupDto) {}
