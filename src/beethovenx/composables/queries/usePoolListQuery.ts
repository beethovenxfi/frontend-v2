import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import {
  PoolListItem,
  UserPortfolio
} from '@/beethovenx/services/beethovenx/beethovenx-types';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import useApp from '@/composables/useApp';

export default function usePoolListQuery(
  options: QueryObserverOptions<PoolListItem[]> = {}
) {
  const queryKey = reactive(QUERY_KEYS.Pools.List());

  const queryFn = async () => {
    const response = await beethovenxService.getPoolList();

    return response;
  };

  const queryOptions = reactive({
    enabled: true,
    ...options,
    refetchInterval: 15000
  });

  return useQuery<PoolListItem[]>(queryKey, queryFn, queryOptions);
}
