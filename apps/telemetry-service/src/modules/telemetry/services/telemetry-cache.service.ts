import { RedisService } from '@libs/redis';
import { Injectable } from '@nestjs/common';
import { PayloadSensorDto } from '../dto/payload-sensor.dto';

@Injectable()
export class TelemetryCacheService {
  constructor(private readonly redis: RedisService) {}

  async updateSensorLatest(payload: PayloadSensorDto) {
    await this.redis.set(`sensor:${payload.sensorCode}`, payload);
  }

  async getSensorLatest(sensorCode: string) {
    return this.redis.get(`sensor:${sensorCode}`);
  }

  async updateMachineStatus(machineCode: string, status: string) {
    await this.redis.set(`machine:${machineCode}`, status);
  }

  async getMachineStatus(machineCode: string) {
    return this.redis.get(`machine:${machineCode}`);
  }
}
