import { computed } from 'vue';
import {
  GqlBeetsUserPendingRewards,
  GqlBeetsUserPendingRewardsToken
} from '@/beethovenx/services/beethovenx/beethovenx-types';
import useUserPendingRewardsQuery from '@/beethovenx/composables/queries/useUserPendingRewardsQuery';

export default function useUserPendingRewards() {
  const userPendingRewardsQuery = useUserPendingRewardsQuery();
  const userPendingRewardsLoading = computed(
    () =>
      userPendingRewardsQuery.isLoading.value ||
      userPendingRewardsQuery.isIdle.value
  );

  const userPendingRewards = computed<GqlBeetsUserPendingRewards>(
    () =>
      userPendingRewardsQuery.data.value ?? {
        farm: {
          numFarms: '0',
          totalBalanceUSD: '0',
          tokens: [],
          farmIds: []
        }
      }
  );

  return {
    userPendingRewardsLoading,
    userPendingRewards,
    userPendingRewardsQuery
  };
}
