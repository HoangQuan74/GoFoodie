import { Controller, Get } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('relationships')
@ApiTags('Relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Get()
  @Public()
  find() {
    return this.relationshipsService.find();
  }
}
