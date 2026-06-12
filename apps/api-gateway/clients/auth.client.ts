// clients/factory.client.ts

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FactoryClient {
  constructor(private readonly httpService: HttpService) {}

  async getMachines() {
    const response = await firstValueFrom<any>(
      this.httpService.get('http://factory-service:3001/machines'),
    );

    return response.data;
  }

  async getMachine(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`http://factory-service:3001/machines/${id}`),
    );

    return response.data;
  }
}
