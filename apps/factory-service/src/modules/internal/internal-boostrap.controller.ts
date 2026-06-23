import { Controller } from '@nestjs/common';
import { InternalBootstrapService } from './internal-boostrap.service';

@Controller('internal-bootstrap')
export class InternalBootstrapController {
  constructor(private readonly internalBootstrapService: InternalBootstrapService) {}
}
