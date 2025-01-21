import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Controller('operations')
@UseGuards(AuthGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  find() {
    return this.operationsService.find();
  }

  @Post()
  create(@Body() body: CreateOperationDto) {
    return this.operationsService.save(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const operation = await this.operationsService.findOne({ where: { id } });
    if (!operation) throw new NotFoundException();

    return this.operationsService.remove(operation);
  }

  @Put(':id')
  async update(@Body() body: UpdateOperationDto, @Param('id') id: number) {
    const operation = await this.operationsService.findOne({ where: { id: id } });
    if (!operation) throw new NotFoundException();

    Object.assign(operation, body);
    return this.operationsService.save(operation);
  }
}
