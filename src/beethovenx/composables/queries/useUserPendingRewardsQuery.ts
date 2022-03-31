import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import { GqlBeetsUserPendingRewards } from '@/beethovenx/services/beethovenx/beethovenx-types';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import useApp from '@/composables/useApp';

export default function useUserPendingRewardsQuery(
  options: QueryObserverOptions<GqlBeetsUserPendingRewards> = {}
) {
  const { appLoading } = useApp();
  const { account, isLoadingProfile } = useWeb3();

  const enabled = computed(
    () => !appLoading.value && !isLoadingProfile.value && !!account.value
  );

  const queryKey = reactive(QUERY_KEYS.Rewards.Pending(account));

  const queryFn = async () => {
    const response = await beethovenxService.getUserPendingRewards(
      account.value
    );

    return response;
  };

  const queryOptions = reactive({
    enabled,
    ...options,
    refetchInterval: 5000
  });

  return useQuery<GqlBeetsUserPendingRewards>(queryKey, queryFn, queryOptions);
}
