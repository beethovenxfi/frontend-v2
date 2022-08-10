import { reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import { beethovenxV2Service } from '@/beethovenx/services/beethovenx/beethovenxV2.service';

interface ProtocolMetrics {
  totalLiquidity: number;
  totalSwapVolume: number;
  totalSwapFee: number;
  poolCount: number;
  swapFee24h: number;
  swapVolume24h: number;
}

export default function useProtocolMetricsQuery(
  options: QueryObserverOptions<ProtocolMetrics> = {}
) {
  const queryFn = async () => {
    const protocolMetrics = await beethovenxV2Service.getProtocolMetrics();

    return {
      totalLiquidity: parseFloat(protocolMetrics.totalLiquidity),
      totalSwapVolume: parseFloat(protocolMetrics.totalSwapVolume),
      totalSwapFee: parseFloat(protocolMetrics.totalSwapFee),
      poolCount: parseInt(protocolMetrics.poolCount),
      swapFee24h: parseFloat(protocolMetrics.swapFee24h),
      swapVolume24h: parseFloat(protocolMetrics.swapVolume24h)
    };
  };

  const queryOptions = reactive({
    enabled: true,
    ...options,
    refetchInterval: 10000
  });

  return useQuery<ProtocolMetrics>(
    QUERY_KEYS.ProtocolMetrics.All,
    queryFn,
    queryOptions
  );
}
