import axios from 'axios';
import { CoinPairsDto } from 'src/dto/tradding-backbone.dto';

export const getPairs = async (): Promise<{
  pairs: CoinPairsDto[];
  symValJ: object;
}> => {
  const pairs: CoinPairsDto[] = [];
  const symValJ = {};

  const resp = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
  const eInfo = resp.data;
  const symbols = [
    ...new Set(
      eInfo.symbols
        .filter((d) => d.status === 'TRADING')
        .map((d) => [d.baseAsset, d.quoteAsset])
        .flat(),
    ),
  ];

  const validPairs = eInfo.symbols
    .filter((d) => d.status === 'TRADING')
    .map((d) => d.symbol);
  validPairs.forEach((symbol) => {
    symValJ[symbol] = { bidPrice: 0, askPrice: 0 };
  });

  const s1 = symbols,
    s2 = symbols,
    s3 = symbols;
  s1.forEach((d1: string) => {
    s2.forEach((d2: string) => {
      s3.forEach((d3: string) => {
        if (!(d1 == d2 || d2 == d3 || d3 == d1)) {
          const lv1 = [];
          const lv2 = [];
          const lv3 = [];
          let l1 = '',
            l2 = '',
            l3 = '';
          if (symValJ[d1 + d2]) {
            lv1.push(d1 + d2);
            l1 = 'num';
          }
          if (symValJ[d2 + d1]) {
            lv1.push(d2 + d1);
            l1 = 'den';
          }

          if (symValJ[d2 + d3]) {
            lv2.push(d2 + d3);
            l2 = 'num';
          }
          if (symValJ[d3 + d2]) {
            lv2.push(d3 + d2);
            l2 = 'den';
          }

          if (symValJ[d3 + d1]) {
            lv3.push(d3 + d1);
            l3 = 'num';
          }
          if (symValJ[d1 + d3]) {
            lv3.push(d1 + d3);
            l3 = 'den';
          }

          if (lv1.length && lv2.length && lv3.length) {
            pairs.push({
              l1: l1,
              l2: l2,
              l3: l3,
              d1: d1,
              d2: d2,
              d3: d3,
              lv1: lv1[0],
              lv2: lv2[0],
              lv3: lv3[0],
              value: -1,
              tpath: '',
            });
          }
        }
      });
    });
  });
  return { pairs, symValJ };
};
