import { Controller } from '@nestjs/common';
import { UniformsService } from './uniforms.service';

@Controller('uniforms')
export class UniformsController {
  constructor(private readonly uniformsService: UniformsService) {}
}
