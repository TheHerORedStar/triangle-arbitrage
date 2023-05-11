import { Injectable } from '@nestjs/common';
import { sort } from 'fast-sort';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Binance = require('binance-api-node').default;
import { Point } from '@influxdata/influxdb-client';
import { clientInfluxDB, getDataFromInflux, getPairs } from 'src/utils';
import MyWebSocketGateway from './socket.service';
import { CoinPairsDto, TraddingBackboneDto } from './dto/tradding-backbone.dto';
import { error } from 'console';

const { INFLUX_ORG, INFLUX_BUCKET } = process.env;

// Create a new instance of the Binance API client
const client = Binance();

// Write data into influx
const writeApi = clientInfluxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);

@Injectable()
export class AppService {
  constructor(private MyWebSocketGatewayService: MyWebSocketGateway) {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  // Crawl data to store into influxDB
  async crawlTradingData(): Promise<void> {
    // Define the markets to subscribe to
    const markets: string[] = ['BTCUSDT', 'ETHBTC', 'ETHUSDT'];

    // Subscribe to order book ticker updates for each market
    markets.forEach((market) => {
      client.ws.bookTicker(market, (ticker) => {
        // Extract the relevant data from the ticker object
        const { symbol, bestBid, bestAsk } = ticker;

        // Write the data to InfluxDB
        const point = new Point('m')
          .tag('symbol', symbol)
          .floatField('bestBid', bestBid)
          .floatField('bestAsk', bestAsk);
        // console.log(` ${point}`);

        // Write the data point to InfluxDB with the specified organization and bucket
        writeApi.writePoint(point);
      });
    });
  }

  // Get data from InfluxDB
  async processDataBackbone(): Promise<TraddingBackboneDto[]> {
    // Create a query to get data from InfluxDB
    const query = `|> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "m")
        |> last()`;
    const data: TraddingBackboneDto[] = await getDataFromInflux(
      INFLUX_ORG,
      INFLUX_BUCKET,
      query,
    );
    return data;
  }

  async traddingDataBackbone(): Promise<void> {
    setInterval(async () => {
      const data: TraddingBackboneDto[] = await this.processDataBackbone();
      await this.MyWebSocketGatewayService.handleMessage('tradding-data', data);
    }, 1000);
  }

  async processData(): Promise<TraddingBackboneDto[]> {
    const data: TraddingBackboneDto[] = await this.processDataBackbone();
    return data;
  }

  // Detect triangle arbitrage
  async detectTriangleArbitrage(): Promise<void> {
    try {
      // get crypto pairs
      const getData = await getPairs();

      const pairs: CoinPairsDto[] = getData.pairs;
      const symValJ: any = getData.symValJ;
      setInterval(async () => {
        // Get data from influxDB
        const data: TraddingBackboneDto[] = await this.processDataBackbone();

        data.forEach((d) => {
          if (d.type == 'bestBid') symValJ[d.symbol].bidPrice = d.value * 1;
          if (d.type == 'bestAsk') symValJ[d.symbol].askPrice = d.value * 1;
        });

        //Perform calculation and send alerts
        pairs.forEach((d) => {
          // Continue if price is not updated for any symbol
          if (
            symValJ[d.lv1]['bidPrice'] &&
            symValJ[d.lv2]['bidPrice'] &&
            symValJ[d.lv3]['bidPrice']
          ) {
            // Level 1 calculation
            let lv_calc: number;
            let lv_str: string;
            if (d.l1 === 'num') {
              lv_calc = symValJ[d.lv1]['bidPrice'];
              lv_str =
                d.d1 +
                '->' +
                d.lv1 +
                "['bidP']['" +
                symValJ[d.lv1]['bidPrice'] +
                "']" +
                '->' +
                d.d2 +
                '<br/>';
            } else {
              lv_calc = 1 / symValJ[d.lv1]['askPrice'];
              lv_str =
                d.d1 +
                '->' +
                d.lv1 +
                "['askP']['" +
                symValJ[d.lv1]['askPrice'] +
                "']" +
                '->' +
                d.d2 +
                '<br/>';
            }

            // Level 2 calculation
            if (d.l2 === 'num') {
              lv_calc *= symValJ[d.lv2]['bidPrice'];
              lv_str +=
                d.d2 +
                '->' +
                d.lv2 +
                "['bidP']['" +
                symValJ[d.lv2]['bidPrice'] +
                "']" +
                '->' +
                d.d3 +
                '<br/>';
            } else {
              lv_calc *= Number(1 / symValJ[d.lv2]['askPrice']);
              lv_str +=
                d.d2 +
                '->' +
                d.lv2 +
                "['askP']['" +
                symValJ[d.lv2]['askPrice'] +
                "']" +
                '->' +
                d.d3 +
                '<br/>';
            }

            // Level 3 calculation
            if (d.l3 === 'num') {
              lv_calc *= symValJ[d.lv3]['bidPrice'];
              lv_str +=
                d.d3 +
                '->' +
                d.lv3 +
                "['bidP']['" +
                symValJ[d.lv3]['bidPrice'] +
                "']" +
                '->' +
                d.d1;
            } else {
              lv_calc *= 1 / symValJ[d.lv3]['askPrice'];
              lv_str +=
                d.d3 +
                '->' +
                d.lv3 +
                "['askP']['" +
                symValJ[d.lv3]['askPrice'] +
                "']" +
                '->' +
                d.d1;
            }

            d.tpath = lv_str;
            d.value = parseFloat(Number((lv_calc - 1) * 100).toFixed(3));
          }
        });

        // Filter to get pairs have profit > 1
        const result = sort(pairs.filter((d) => d.value > 0)).desc(
          (u: any) => u.value,
        );
        await this.MyWebSocketGatewayService.handleMessage(
          'detect-profit',
          result,
        );
      }, 3000);
    } catch (err) {
      error(err);
    }
  }
}
