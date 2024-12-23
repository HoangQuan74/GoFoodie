import { Module } from '@nestjs/common';
import { UniformsService } from './uniforms.service';
import { UniformsController } from './uniforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniformEntity } from 'src/database/entities/uniform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniformEntity])],
  controllers: [UniformsController],
  providers: [UniformsService],
  exports: [UniformsService],
})
export class UniformsModule {}
