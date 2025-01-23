import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { FeeService } from './fee.service';
import { calculateDistance } from 'src/utils/distance';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get('shipping/:distance')
  async getShippingFee(@Param('distance') distance: number) {
    return this.feeService.getShippingFee(distance);
  }

  @Get('shipping')
  @ApiOperation({ summary: 'Get shipping fee based on coordinates' })
  @ApiQuery({ name: 'clientLat', required: true, type: Number, description: 'Latitude of the client location' })
  @ApiQuery({ name: 'clientLon', required: true, type: Number, description: 'Longitude of the client location' })
  @ApiQuery({ name: 'storeLat', required: true, type: Number, description: 'Latitude of the store location' })
  @ApiQuery({ name: 'storeLon', required: true, type: Number, description: 'Longitude of the store location' })
  @ApiResponse({
    status: 200,
    description: 'Returns the distance and shipping fee',
    schema: {
      type: 'object',
      properties: {
        distance: { type: 'number', description: 'Distance between client and store in km', example: 5.67 },
        shippingFee: { type: 'number', description: 'Calculated shipping fee', example: 20000 },
        unit: { type: 'string', description: 'Unit of measurement for distance', example: 'km' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid coordinates or distance exceeds maximum allowed.' })
  async getShippingFeeByCoordinates(
    @Query('clientLat') clientLat: string,
    @Query('clientLon') clientLon: string,
    @Query('storeLat') storeLat: string,
    @Query('storeLon') storeLon: string,
  ) {
    if (!clientLat || !clientLon || !storeLat || !storeLon) {
      throw new BadRequestException('All coordinates (clientLat, clientLon, storeLat, storeLon) are required');
    }

    const coordinates = [
      { name: 'clientLat', value: clientLat },
      { name: 'clientLon', value: clientLon },
      { name: 'storeLat', value: storeLat },
      { name: 'storeLon', value: storeLon },
    ].map((coord) => {
      const num = parseFloat(coord.value);
      if (isNaN(num)) {
        throw new BadRequestException(`Invalid ${coord.name}: ${coord.value}. Must be a valid number.`);
      }
      return num;
    });

    const [parsedClientLat, parsedClientLon, parsedStoreLat, parsedStoreLon] = coordinates;

    const distance = calculateDistance(parsedClientLat, parsedClientLon, parsedStoreLat, parsedStoreLon);

    const shippingFee = await this.feeService.getShippingFee(distance);

    return {
      distance: Number(distance.toFixed(2)),
      shippingFee,
      unit: 'km',
    };
  }
}
