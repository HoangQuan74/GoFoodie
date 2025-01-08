import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WorkingSessionsService } from './working-sessions.service';
import { DataSource, IsNull } from 'typeorm';
import { CurrentUser } from 'src/common/decorators';
import { AuthGuard } from '../auth/auth.guard';
import { DriverWorkingSessionEntity } from 'src/database/entities/working-sessions.entity';
import { JwtPayload } from 'src/common/interfaces';

@Controller('working-sessions')
@UseGuards(AuthGuard)
export class WorkingSessionsController {
  constructor(
    private readonly workingSessionsService: WorkingSessionsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('start')
  async startWorkingSession(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;

    const options = { where: { driverId, endTime: IsNull() } };
    const session = await this.workingSessionsService.findOne(options);
    if (session) return session;

    const workingSession = new DriverWorkingSessionEntity();
    workingSession.driverId = driverId;

    return this.workingSessionsService.save(workingSession);
  }

  @Post('end')
  async endWorkingSession(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;

    const options = { where: { driverId, endTime: IsNull() } };
    const workingSession = await this.workingSessionsService.findOne(options);
    if (!workingSession) return;

    workingSession.endTime = new Date();

    return this.workingSessionsService.save(workingSession);
  }

  @Get('current')
  async getCurrentWorkingSession(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;

    const options = { where: { driverId, endTime: IsNull() } };
    return this.workingSessionsService.findOne(options);
  }
}
