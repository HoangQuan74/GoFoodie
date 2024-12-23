import { Controller, Get } from '@nestjs/common';
import { UniformSizesService } from './uniform-sizes.service';
import { Public } from 'src/common/decorators';

@Controller('uniform-sizes')
export class UniformSizesController {
  constructor(private readonly uniformSizesService: UniformSizesService) {}

  @Get()
  @Public()
  async find() {
    return this.uniformSizesService.find();
  }
}
