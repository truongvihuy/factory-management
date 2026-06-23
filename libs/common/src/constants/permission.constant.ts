import { Role } from 'generated/prisma';

export enum PermissionCode {
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

  // Device
  DEVICE_READ = 'device.read',
  DEVICE_CREATE = 'device.create',
  DEVICE_UPDATE = 'device.update',
  DEVICE_DELETE = 'device.delete',

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
    PermissionCode.USER_READ,
    PermissionCode.USER_CREATE,
    PermissionCode.USER_UPDATE,
    PermissionCode.USER_DELETE,
    // UserRole
    PermissionCode.ROLE_READ,
    PermissionCode.ROLE_CREATE,
    PermissionCode.ROLE_UPDATE,
    PermissionCode.ROLE_DELETE,
    // Factory
    PermissionCode.FACTORY_READ,
    PermissionCode.FACTORY_CREATE,
    PermissionCode.FACTORY_UPDATE,
    PermissionCode.FACTORY_DELETE,
  ],
  [Role.MANAGER]: [
    // User
    PermissionCode.USER_READ,
    // Factory
    PermissionCode.FACTORY_READ,
    // Workshop
    PermissionCode.WORKSHOP_READ,
    // Machine
    PermissionCode.MACHINE_READ,
    PermissionCode.MACHINE_CREATE,
    PermissionCode.MACHINE_UPDATE,
    PermissionCode.MACHINE_DELETE,
    // Sensor
    PermissionCode.SENSOR_READ,
    PermissionCode.SENSOR_CREATE,
    PermissionCode.SENSOR_UPDATE,
    PermissionCode.SENSOR_DELETE,
    // Telemetry
    PermissionCode.TELEMETRY_READ,
  ],
  [Role.ENGINEER]: [
    // User
    PermissionCode.USER_READ,
    // Factory
    PermissionCode.FACTORY_READ,
    // Workshop
    PermissionCode.WORKSHOP_READ,
    // Machine
    PermissionCode.MACHINE_READ,
    PermissionCode.MACHINE_CREATE,
    PermissionCode.MACHINE_UPDATE,
    PermissionCode.MACHINE_DELETE,
    // Sensor
    PermissionCode.SENSOR_READ,
    PermissionCode.SENSOR_CREATE,
    PermissionCode.SENSOR_UPDATE,
    PermissionCode.SENSOR_DELETE,
    // Telemetry
    PermissionCode.TELEMETRY_READ,
  ],
  [Role.OPERATOR]: [
    // User
    PermissionCode.USER_READ,
    // Factory
    PermissionCode.FACTORY_READ,
    // Workshop
    PermissionCode.WORKSHOP_READ,
    // Machine
    PermissionCode.MACHINE_READ,
    PermissionCode.MACHINE_CREATE,
    PermissionCode.MACHINE_UPDATE,
    PermissionCode.MACHINE_DELETE,
    // Sensor
    PermissionCode.SENSOR_READ,
    PermissionCode.SENSOR_CREATE,
    PermissionCode.SENSOR_UPDATE,
    PermissionCode.SENSOR_DELETE,
    // Telemetry
    PermissionCode.TELEMETRY_READ,
  ],
  [Role.VIEW]: [
    // User
    PermissionCode.USER_READ,
    // Factory
    PermissionCode.FACTORY_READ,
    // Workshop
    PermissionCode.WORKSHOP_READ,
    // Machine
    PermissionCode.MACHINE_READ,
    // Sensor
    PermissionCode.SENSOR_READ,
    // Telemetry
    PermissionCode.TELEMETRY_READ,
  ],
};
