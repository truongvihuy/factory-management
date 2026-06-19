// libs/auth/src/constants/permissions.constant.ts

import { Role } from 'generated/prisma';

export enum Permission {
  // User
  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  // Role
  ROLE_READ = 'role.read',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  // Factory
  FACTORY_READ = 'factory.read',
  FACTORY_CREATE = 'factory.create',
  FACTORY_UPDATE = 'factory.update',
  FACTORY_DELETE = 'factory.delete',

  // Workshop
  WORKSHOP_READ = 'workshop.read',
  WORKSHOP_CREATE = 'workshop.create',
  WORKSHOP_UPDATE = 'workshop.update',
  WORKSHOP_DELETE = 'workshop.delete',

  // Machine
  MACHINE_READ = 'machine.read',
  MACHINE_CREATE = 'machine.create',
  MACHINE_UPDATE = 'machine.update',
  MACHINE_DELETE = 'machine.delete',

  // Sensor
  SENSOR_READ = 'sensor.read',
  SENSOR_CREATE = 'sensor.create',
  SENSOR_UPDATE = 'sensor.update',
  SENSOR_DELETE = 'sensor.delete',

  // Telemetry
  TELEMETRY_READ = 'telemetry.read',
  TELEMETRY_CREATE = 'telemetry.create',
  TELEMETRY_UPDATE = 'telemetry.update',
  TELEMETRY_DELETE = 'telemetry.delete',

  // Alarm
  ALARM_READ = 'alarm.read',
  ALARM_ACK = 'alarm.ack',
}

export const ROLE_PERMISSIONS = {
  ADMIN: [
    // User
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    // Factory
    Permission.FACTORY_READ,
    Permission.FACTORY_CREATE,
    Permission.FACTORY_UPDATE,
    Permission.FACTORY_DELETE,
  ],
  [Role.MANAGER]: [
    // User
    Permission.USER_READ,
    // Factory
    Permission.FACTORY_READ,
    // Workshop
    Permission.WORKSHOP_READ,
    // Machine
    Permission.MACHINE_READ,
    Permission.MACHINE_CREATE,
    Permission.MACHINE_UPDATE,
    Permission.MACHINE_DELETE,
    // Sensor
    Permission.SENSOR_READ,
    Permission.SENSOR_CREATE,
    Permission.SENSOR_UPDATE,
    Permission.SENSOR_DELETE,
    // Telemetry
    Permission.TELEMETRY_READ,
  ],
  [Role.ENGINEER]: [
    // User
    Permission.USER_READ,
    // Factory
    Permission.FACTORY_READ,
    // Workshop
    Permission.WORKSHOP_READ,
    // Machine
    Permission.MACHINE_READ,
    Permission.MACHINE_CREATE,
    Permission.MACHINE_UPDATE,
    Permission.MACHINE_DELETE,
    // Sensor
    Permission.SENSOR_READ,
    Permission.SENSOR_CREATE,
    Permission.SENSOR_UPDATE,
    Permission.SENSOR_DELETE,
    // Telemetry
    Permission.TELEMETRY_READ,
  ],
  [Role.OPERATOR]: [
    // User
    Permission.USER_READ,
    // Factory
    Permission.FACTORY_READ,
    // Workshop
    Permission.WORKSHOP_READ,
    // Machine
    Permission.MACHINE_READ,
    Permission.MACHINE_CREATE,
    Permission.MACHINE_UPDATE,
    Permission.MACHINE_DELETE,
    // Sensor
    Permission.SENSOR_READ,
    Permission.SENSOR_CREATE,
    Permission.SENSOR_UPDATE,
    Permission.SENSOR_DELETE,
    // Telemetry
    Permission.TELEMETRY_READ,
  ],
  [Role.VIEW]: [
    // User
    Permission.USER_READ,
    // Factory
    Permission.FACTORY_READ,
    // Workshop
    Permission.WORKSHOP_READ,
    // Machine
    Permission.MACHINE_READ,
    // Sensor
    Permission.SENSOR_READ,
    // Telemetry
    Permission.TELEMETRY_READ,
  ],
};
