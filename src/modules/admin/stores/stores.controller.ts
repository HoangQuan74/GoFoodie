import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stores')
@ApiTags('Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body () body: CreateStoreDto) {
    return 'Create store';
  }
}
