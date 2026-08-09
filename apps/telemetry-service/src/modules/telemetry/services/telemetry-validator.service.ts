import { Injectable } from '@nestjs/common';
import type { Device, Machine, Sensor } from '@prisma';
import { createHmac } from 'crypto';
import type { PayloadSensorDto } from '../dto/payload-sensor.dto';
import type { DeviceMetadataRepository } from '../repositories/device-metadata.repository';
import type { MachineMetadataRepository } from '../repositories/machine-metadata.repository';
import type { SensorMetadataRepository } from '../repositories/sensor-metadata.repository';

@Injectable()
export class TelemetryValidatorService {
  constructor(
    private readonly machineMetadataRepository: MachineMetadataRepository,
    private readonly sensorMetadataRepository: SensorMetadataRepository,
    private readonly deviceMetadataRepository: DeviceMetadataRepository,
  ) {}

  async updateMetadata(machines: Machine[], devices: Device[], sensors: Sensor[]) {
    const _mapIdMachineCode = {} as any;
    machines.map((machine) => {
      _mapIdMachineCode[machine.id] = machine.code;
    });
    const _sensors = sensors.map((sen) => {
      return {
        ...sen,
        machineCode: _mapIdMachineCode[sen.machineId],
      };
    });

    const _devices = devices.map((dev) => {
      return {
        ...dev,
        machineCode: _mapIdMachineCode[dev.machineId],
      };
    });

    await this.machineMetadataRepository.initMetadata(machines);
    await this.sensorMetadataRepository.initMetadata(_sensors);
    await this.deviceMetadataRepository.initMetadata(_devices);
  }

  async validate(payload: PayloadSensorDto): Promise<void> {
    const [machine, sensor, device] = await Promise.all([
      this.machineMetadataRepository.get(payload.machineCode),
      this.sensorMetadataRepository.get(payload.sensorCode),
      this.deviceMetadataRepository.get(payload.deviceCode),
    ]);
    if (!machine) {
      throw new Error('Machine not found');
    }

    if (!sensor) {
      throw new Error('Sensor not found');
    }

    if (!device) {
      throw new Error('Device not found');
    }

    if (device.machineCode !== payload.machineCode || sensor.machineCode !== payload.machineCode) {
      throw new Error('Mahine/sensor/device not ownership');
    }

    if (payload.value === null || payload.value === undefined) {
      throw new Error('Value missing');
    }

    const _payload = {
      deviceCode: payload.deviceCode,
      machineCode: payload.machineCode,
      sensorCode: payload.sensorCode,
      timestamp: payload.timestamp,
      value: payload.value,
    };

    const expected = createHmac('sha256', device.secretKey).update(JSON.stringify(_payload)).digest('hex');

    if (expected !== payload.signature) {
      throw new Error('Signature invalid');
    }
  }
}
