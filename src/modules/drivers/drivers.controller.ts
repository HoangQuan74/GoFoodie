import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AuthGuard } from './auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SignContractDto } from './dto/sign-contract.dto';
import { RegisterUniformDto } from './dto/register-uniform.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('drivers')
@ApiTags('Drivers')
@UseGuards(AuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('sign-contract')
  async signContract(@Body() signContractDto: SignContractDto, @CurrentUser() user: JwtPayload) {
    const { signatureImageId } = signContractDto;
    const { id } = user;

    const driver = await this.driversService.findOne({ where: { id: id }, relations: ['signature'] });
    if (!driver) throw new NotFoundException();

    const signature = { signatureImageId };
    this.driversService.merge(driver, { signature });

    return this.driversService.save(driver);
  }

  @Post('register-uniform')
  async registerUniform(@Body() registerUniformDto: RegisterUniformDto, @CurrentUser() user: JwtPayload) {
    const { id } = user;
    const driver = await this.driversService.findOne({ select: ['id'], where: { id }, relations: ['uniforms'] });
    if (!driver) throw new NotFoundException();

    

    
  }
}
