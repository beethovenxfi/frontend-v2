import { JsonRpcProvider } from '@ethersproject/providers';
import ConfigService, { configService } from '@/services/config/config.service';
import { Network } from '@/composables/useNetwork';
import { StaticJsonRpcBatchProvider } from '@/services/rpc-provider/static-json-rpc-batch-provider';

type NewBlockHandler = (blockNumber: number) => any;

export default class RpcProviderService {
  readonly network: string;
  jsonProvider: JsonRpcProvider;

  constructor(private readonly config: ConfigService = configService) {
    this.network = this.config.network.shortName;
    this.jsonProvider = new StaticJsonRpcBatchProvider(this.config.rpc);
  }

  public initBlockListener(newBlockHandler: NewBlockHandler): void {
    this.jsonProvider.on('block', newBlockNumber => {
      newBlockHandler(newBlockNumber);
    });
  }

  public async getBlockNumber(): Promise<number> {
    return await this.jsonProvider.getBlockNumber();
  }

  public getJsonProvider(networkKey: Network): JsonRpcProvider {
    const rpcUrl = `${this.config.getNetworkConfig(networkKey).rpc}/${
      this.config.env.INFURA_PROJECT_ID
    }`;

    return new StaticJsonRpcBatchProvider(rpcUrl);
  }
}

export const rpcProviderService = new RpcProviderService();
