import { Controller, Get } from '@nestjs/common';
import { InternalBootstrapService } from './internal-boostrap.service';

@Controller('internal-bootstrap')
export class InternalBootstrapController {
  constructor(private readonly internalBootstrapService: InternalBootstrapService) {}

  @Get('machines')
  getMachines() {
    return this.internalBootstrapService.getMachines();
  }

  @Get('sensors')
  getSensors() {
    return this.internalBootstrapService.getSensors();
  }

  @Get('devices')
  getDevices() {
    return this.internalBootstrapService.getDevices();
  }
}
