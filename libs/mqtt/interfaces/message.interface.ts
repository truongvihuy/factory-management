export interface MqttMessage<T = any> {
  topic: string;
  payload: T;
}
