import { Controller } from '@nestjs/common';
import { MailHistoriesService } from './mail-histories.service';

@Controller('mail-histories')
export class MailHistoriesController {
  constructor(private readonly mailHistoriesService: MailHistoriesService) {}
}
