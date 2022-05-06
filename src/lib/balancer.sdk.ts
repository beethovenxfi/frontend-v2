import { configService } from '@/services/config/config.service';
import { BalancerSDK, Network, SubgraphPoolBase } from '@balancer-labs/sdk';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import { getAddress } from '@ethersproject/address';

export const balancer = new BalancerSDK({
  network: {
    chainId: configService.network.chainId as Network,
    addresses: {
      contracts: {
        vault: configService.network.addresses.vault,
        multicall: configService.network.addresses.multicall,
        batchRelayer: configService.network.addresses.batchRelayer
      },
      tokens: {
        wrappedNativeAsset: configService.network.addresses.weth
      },
      linearFactories: {
        '0x1f73ae6ed391a2b1e84ff988a1bb5394b78a4a71': 'yearn',
        '0xba306e3cf84751d8ef5e812c18caa6c567c783e8': 'boo',
        '0x80434cf3661313d1a0632f567c1ba389ee2f7665': 'reaper',
        '0xbfd55a29bf62b28e3bd16974a054c66f195fc5ef': 'tarot'
      }
    },
    urls: {
      subgraph: configService.network.poolsUrlV2
    },
    pools: {
      staBal3Pool: {
        id:
          '0x5ddb92a5340fd0ead3987d3661afcd6104c3b757000000000000000000000187',
        address: '0x5ddb92a5340fd0ead3987d3661afcd6104c3b757'
      }
    },
    fBeets: {
      address: configService.network.fBeets.address,
      farmId: parseInt(configService.network.fBeets.farmId),
      poolId: configService.network.fBeets.poolId
    }
  },
  rpcUrl: configService.network.rpc,
  sor: {
    tokenPriceService: {
      getNativeAssetPriceInToken: async (tokenAddress: string) => {
        try {
          const tokenPrices = beethovenxService.getCachedTokenPrices();
          const nativeAssetPrice =
            tokenPrices[configService.network.addresses.weth]?.usd || 0;
          const tokenPrice = tokenPrices[getAddress(tokenAddress)]?.usd || 1;

          return `${nativeAssetPrice / tokenPrice}`;
        } catch {
          return '0';
        }
      }
    },
    poolDataService: {
      getPools: async () => {
        const pools = (await balancerSubgraphService.pools.get()) as SubgraphPoolBase[];

        return pools;
      }
    }
  }
});
