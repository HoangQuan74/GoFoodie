import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { GOONG_API_KEY, GOONG_URL } from 'src/common/constants';
import { EVehicleType } from 'src/common/enums/map.enum';
import { IDistanceAndDuration, ILocation } from 'src/common/interfaces/map.interface';
import { DistanceEntity } from 'src/database/entities/distance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MapboxService {
  constructor(
    @InjectRepository(DistanceEntity)
    private readonly distanceRepository: Repository<DistanceEntity>,
  ) {}

  async getDistanceAndDuration(
    origin: ILocation,
    destination: ILocation,
    vehicle: EVehicleType = EVehicleType.Car,
  ): Promise<IDistanceAndDuration> {
    const distance = await this.distanceRepository
      .createQueryBuilder('distance')
      .select()
      .where('originLat = :originLat', { originLat: origin.lat })
      .andWhere('originLng = :originLng', { originLng: origin.lng })
      .andWhere('destinationLat = :destinationLat', { destinationLat: destination.lat })
      .andWhere('destinationLng = :destinationLng', { destinationLng: destination.lng })
      .getOne();

    if (distance) {
      return {
        distance: distance.distanceValue,
        duration: distance.durationValue,
      };
    }

    const { data } = await axios.get(`${GOONG_URL}/DistanceMatrix`, {
      params: {
        api_key: GOONG_API_KEY,
        origins: `${origin.lat},${origin.lng}`,
        destinations: `${destination.lat},${destination.lng}`,
        vehicle,
      },
    });

    const result = {
      distance: data.rows[0].elements[0].distance.value,
      duration: data.rows[0].elements[0].duration.value,
    };

    await this.distanceRepository.save({
      originLat: origin.lat,
      originLng: origin.lng,
      destinationLat: destination.lat,
      destinationLng: destination.lng,
      distanceValue: result.distance,
      durationValue: result.duration,
    });

    return result;
  }
}
