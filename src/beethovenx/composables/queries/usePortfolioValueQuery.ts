import { computed, reactive } from 'vue';
import { useQuery } from 'vue-query';
import { QueryObserverOptions } from 'react-query/core';
import QUERY_KEYS from '@/beethovenx/constants/queryKeys';
import useWeb3 from '@/services/web3/useWeb3';
import { beethovenxService } from '@/beethovenx/services/beethovenx/beethovenx.service';
import useApp from '@/composables/useApp';

export default function usePortfolioValueQuery(
  options: QueryObserverOptions<string> = {}
) {
  const { appLoading } = useApp();
  const { account, chainId, isLoadingProfile } = useWeb3();

  const enabled = computed(
    () => !appLoading.value && !isLoadingProfile.value && !!account.value
  );

  const queryKey = reactive(
    QUERY_KEYS.Account.PortfolioValue(account, chainId)
  );

  const queryFn = async () => {
    const response = await beethovenxService.getUserPortfolioValue(
      account.value
    );

    return response;
  };

  const queryOptions = reactive({
    enabled,
    refetchInterval: 30000,
    ...options
  });

  return useQuery<string>(queryKey, queryFn, queryOptions);
}
