import { createHmac } from 'crypto';
import mqtt from 'mqtt';

const MESSAGE_PER_SECOND = 1000;
const SENSOR_COUNT = 100;

const client = mqtt.connect({
  host: process.env.MQTT_HOST,
  path: process.env.MQTT_PORT,
});

client.on('connect', () => {
  console.log('🚀 MQTT Connected');

  let totalSent = 0;

  setInterval(() => {
    const start = Date.now();

    const MacCode = 'FAC_1-WS_1-MAC_1';
    const DeviceCode = 'FAC_1-WS_1-MAC_1-DEV_1';
    const SecretKey = 'DEVICE_1';
    const SensorCodes = [
      'FAC_1-WS_1-MAC_1-SEN_1',
      'FAC_1-WS_1-MAC_1-SEN_2',
      'FAC_1-WS_1-MAC_1-SEN_3',
      'FAC_1-WS_1-MAC_1-SEN_4',
      'FAC_1-WS_1-MAC_1-SEN_5',
      'FAC_1-WS_1-MAC_1-SEN_6',
      'FAC_1-WS_1-MAC_1-SEN_7',
      'FAC_1-WS_1-MAC_1-SEN_8',
      'FAC_1-WS_1-MAC_1-SEN_9',
      'FAC_1-WS_1-MAC_1-SEN_10',
    ];

    for (let i = 0; i < SensorCodes.length; i++) {
      const sensorCode = SensorCodes[i];

      const data = {
        deviceCode: DeviceCode,
        machineCode: MacCode,
        sensorCode,
        timestamp: +new Date(),
        value: Number((Math.random() * 100).toFixed(2)),
      };

      const signature = createHmac('sha256', SecretKey).update(JSON.stringify(data)).digest('hex');

      const message = JSON.stringify({ ...data, signature });

      client.publish(`device/${DeviceCode}`, message);

      totalSent++;
    }

    console.log(`Sent ${MESSAGE_PER_SECOND} messages in ${Date.now() - start}ms | Total: ${totalSent}`);
  }, 1000);
});
