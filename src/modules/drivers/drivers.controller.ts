import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AuthGuard } from './auth/auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignContractDto } from './dto/sign-contract.dto';
import { RegisterUniformDto } from './dto/register-uniform.dto';
import { CurrentUser, Public } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { DriverUniformEntity } from 'src/database/entities/driver-uniform.entity';
import { UniformsService } from './uniforms/uniforms.service';
import { EDriverUniformStatus } from 'src/common/enums/driver.enum';

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

  @Get('register-uniforms')
  async getUniforms(@CurrentUser() user: JwtPayload) {
    const { id } = user;

    const driver = await this.driversService.findOne({ where: { id }, relations: ['uniforms', 'uniforms.size'] });
    if (!driver) throw new NotFoundException();

    return driver.uniforms;
  }

  @Get('uniforms')
  async getUniformInfo() {
    return this.uniformsService.findOne({ where: {}, relations: ['sizes', 'uniformImages'] });
  }

  @Post('upload-uniform')
  @ApiBody({ schema: { type: 'object', properties: { uniformImageId: { type: 'string' } } } })
  async uploadUniform(@Body() { uniformImageId }: { uniformImageId: string }, @CurrentUser() user: JwtPayload) {
    const { id } = user;

    const driver = await this.driversService.findOne({ where: { id }, relations: ['uniforms'] });
    if (!driver) throw new NotFoundException();

    const driverUniform = driver.uniforms.find((uniform) => uniform.status === EDriverUniformStatus.Ordered);
    if (!driverUniform) throw new NotFoundException();

    driverUniform.uniformImageId = uniformImageId;
    driverUniform.status = EDriverUniformStatus.Received;

    return this.driversService.save(driver);
  }
}
