import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ReviewDriverDto } from './dto/review-driver.dto';
import { ReviewStoreDto } from './dto/review-store.dto';

@Controller('reviews')
@ApiTags('Reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':orderId/driver')
  reviewDriver(
    @Param('orderId') orderId: string,
    @Body() reviewDriverDto: ReviewDriverDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { id: clientId } = user;
    return this.reviewsService.reviewDriver(+orderId, clientId, reviewDriverDto);
  }

  @Post(':orderId/store')
  reviewStore(
    @Param('orderId') orderId: string,
    @Body() reviewStoreDto: ReviewStoreDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { id: clientId } = user;
    return this.reviewsService.reviewStore(+orderId, clientId, reviewStoreDto);
  }

  // lấy phần thưởng khi đánh giá
  @Get('reward')
  getReward(@CurrentUser() user: JwtPayload) {
    return this.reviewsService.getReward();
  }
}
