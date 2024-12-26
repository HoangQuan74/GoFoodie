import { Controller } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';

@Controller('option-groups')
export class OptionGroupsController {
  constructor(private readonly optionGroupsService: OptionGroupsService) {}
}
