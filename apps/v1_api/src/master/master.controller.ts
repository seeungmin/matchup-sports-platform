import { Controller, Get } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('sports')
  getSports() {
    return this.masterService.getSports();
  }

  @Get('regions')
  getRegions() {
    return this.masterService.getRegions();
  }
}
