import { configService as _configService } from '@/services/config/config.service';
import axios from 'axios';
import { GqlProtocolMetrics } from './beethovenxV2-types';

export type Price = { [fiat: string]: number };
export type TokenPrices = { [address: string]: Price };
export type HistoricalPrices = { [timestamp: string]: number[] };

export default class BeethovenxV2Service {
  private readonly url: string;
  private tokenPrices: TokenPrices = {};

  constructor(private readonly configService = _configService) {
    this.url = 'https://backend-v2.beets-ftm-node.com/';
  }

  private async get<T>(query: string, address?: string): Promise<T> {
    try {
      const {
        data: { data }
      } = await axios.post(
        this.url,
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            AccountAddress: address,
            'apollographql-client-name': 'web',
            'apollographql-client-version': '1.0'
          }
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getProtocolMetrics(): Promise<GqlProtocolMetrics> {
    const query = `
      query GetProtocolData {
        protocolData: protocolMetrics {
          totalLiquidity
          totalSwapVolume
          totalSwapFee
          poolCount
          swapFee24h
          swapVolume24h
        }
      }
    `;

    const { protocolData } = await this.get<{
      protocolData: GqlProtocolMetrics;
    }>(query);

    return protocolData;
  }
}

export const beethovenxV2Service = new BeethovenxV2Service();
