import { reactive } from 'vue';
import { useInfiniteQuery } from 'vue-query';
import { UseInfiniteQueryOptions } from 'react-query/types';

import QUERY_KEYS from '@/constants/queryKeys';
import { POOLS } from '@/constants/pools';

import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { PoolActivity } from '@/services/balancer/subgraph/types';
import useNetwork from '../useNetwork';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import { GqlBalancerPoolActivity } from '@/beethovenx/services/beethovenx/beethovenx-types';

type PoolActivitiesQueryResponse = {
  poolActivities: GqlBalancerPoolActivity[];
  skip?: number;
};

export default function usePoolActivitiesQuery(
  id: string,
  options: UseInfiniteQueryOptions<PoolActivitiesQueryResponse> = {}
) {
  // COMPOSABLES
  const { networkId } = useNetwork();

  // DATA
  const queryKey = reactive(QUERY_KEYS.Pools.Activities(networkId, id));

  // METHODS
  const queryFn = async ({ pageParam = 0 }) => {
    const poolActivities = await beethovenxService.getBalancerPoolActivities({
      poolId: id,
      first: POOLS.Pagination.PerPage,
      skip: pageParam
    });

    return {
      poolActivities,
      skip:
        poolActivities.length >= POOLS.Pagination.PerPage
          ? pageParam + POOLS.Pagination.PerPage
          : undefined
    };
  };

  const queryOptions = reactive({
    getNextPageParam: (lastPage: PoolActivitiesQueryResponse) => lastPage.skip,
    ...options
  });

  return useInfiniteQuery<PoolActivitiesQueryResponse>(
    queryKey,
    queryFn,
    queryOptions
  );
}
