import { FluxTableMetaData } from '@influxdata/influxdb-client';
import { clientInfluxDB } from '../client-influxdb';

export const getDataFromInflux = (
  INFLUX_ORG: string,
  INFLUX_BUCKET: string,
  sqlFilter: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const queryApi = clientInfluxDB.getQueryApi(INFLUX_ORG);
    const listData: any[] = [];
    const query = `from(bucket: "${INFLUX_BUCKET}")
  ${sqlFilter}
  `;
    queryApi.queryRows(query, {
      next(row: string[], tableMeta: FluxTableMetaData) {
        const rowOne = tableMeta.toObject(row);
        listData.push(rowOne);
      },
      error(error: Error) {
        console.error(error);
        reject(error);
        // console.log('\\nFinished ERROR');
      },
      complete() {
        for (const data of listData) {
          data.time = new Date(data._time).getTime();
          data.value = data._value;
          data.type = data._field;

          delete data.result;
          delete data.table;
          delete data._start;
          delete data._stop;
          delete data._time;
          delete data._value;
          delete data._field;
          delete data._measurement;
        }

        resolve(listData);
        // console.log('\\nFinished SUCCESS');
      },
    });
  });
};
