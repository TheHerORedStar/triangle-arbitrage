import { InfluxDB } from '@influxdata/influxdb-client';

const { INFLUX_URL, INFLUX_TOKEN } = process.env;

export const clientInfluxDB = new InfluxDB({
  url: INFLUX_URL,
  token: INFLUX_TOKEN,
  timeout: 30000,
});
