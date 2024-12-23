import { Module } from '@nestjs/common';
import { UniformSizesService } from './uniform-sizes.service';
import { UniformSizesController } from './uniform-sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniformSizeEntity } from 'src/database/entities/uniform-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniformSizeEntity])],
  controllers: [UniformSizesController],
  providers: [UniformSizesService],
})
export class UniformSizesModule {}
