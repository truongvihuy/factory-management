export interface MqttModuleOptions {
  brokerUrl: string;
  username?: string;
  password?: string;
  reconnectPeriod?: number;
  connectTimeout?: number;
}
