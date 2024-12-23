import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AuthGuard } from './auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignContractDto } from './dto/sign-contract.dto';
import { RegisterUniformDto } from './dto/register-uniform.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { UniformsService } from '../admin/uniforms/uniforms.service';
import { DriverUniformEntity } from 'src/database/entities/driver-uniform.entity';

@Controller('drivers')
@ApiTags('Drivers')
@UseGuards(AuthGuard)
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    private readonly uniformsService: UniformsService,
  ) {}

  @Post('sign-contract')
  @ApiOperation({ summary: 'Ký hợp đồng' })
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
  @ApiOperation({ summary: 'Đăng ký đồng phục' })
  async registerUniform(@Body() registerUniformDto: RegisterUniformDto, @CurrentUser() user: JwtPayload) {
    const { id } = user;

    const driver = await this.driversService.findOne({ select: ['id'], where: { id }, relations: ['uniforms'] });
    if (!driver) throw new NotFoundException();

    const uniform = await this.uniformsService.findOne({ where: {} });
    if (!uniform) throw new NotFoundException();

    const driverUniform = new DriverUniformEntity();
    Object.assign(driverUniform, registerUniformDto);
    driverUniform.uniformFee = uniform.price;
    driverUniform.shipFee = uniform.deliveryFee;
    driver.uniforms.push(driverUniform);

    return this.driversService.save(driver);
  }

  @Get('uniforms')
  async getUniforms(@CurrentUser() user: JwtPayload) {
    const { id } = user;

    const driver = await this.driversService.findOne({ where: { id }, relations: ['uniforms', 'uniforms.size'] });
    if (!driver) throw new NotFoundException();

    return driver.uniforms;
  }
}
