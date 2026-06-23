import mqtt from 'mqtt';

const MQTT_URL = process.env.MQTT_URL || '';
const MESSAGE_PER_SECOND = 1000;
const SENSOR_COUNT = 100;

const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  console.log('🚀 MQTT Connected');

  let totalSent = 0;

  setInterval(() => {
    const start = Date.now();

    for (let i = 0; i < MESSAGE_PER_SECOND; i++) {
      const sensorId = `sensor-${i % SENSOR_COUNT}`;

      client.publish(
        `machine/machine-1/sensor/${sensorId}`,
        JSON.stringify({
          sensorId,
          value: Number((Math.random() * 100).toFixed(2)),
          timestamp: new Date().toISOString(),
        }),
      );

      totalSent++;
    }

    console.log(`Sent ${MESSAGE_PER_SECOND} messages in ${Date.now() - start}ms | Total: ${totalSent}`);
  }, 1000);
});
