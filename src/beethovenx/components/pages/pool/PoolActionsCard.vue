<script setup lang="ts">
import { computed, onBeforeMount, ref, toRef } from 'vue';
import useWithdrawMath from '@/components/forms/pool_actions/WithdrawForm/composables/useWithdrawMath';
import { FullPool } from '@/services/balancer/subgraph/types';
import useTokens from '@/composables/useTokens';
import useNumbers from '@/composables/useNumbers';
import useUserSettings from '@/composables/useUserSettings';
import { bnum } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import { getAddress } from '@ethersproject/address';
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import FarmActionsCard from '@/beethovenx/components/pages/farm/FarmActionsCard.vue';
import { lpTokensFor } from '@/composables/usePool';
import usePools from '@/composables/pools/usePools';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import BalAlert from '@/components/_global/BalAlert/BalAlert.vue';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
  missingPrices: boolean;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { usdAsset } = usePoolTransfers();
const { initMath, hasBpt } = useWithdrawMath(toRef(props, 'pool'), usdAsset);
const { balanceFor, nativeAsset, wrappedNativeAsset } = useTokens();
const { fNum, toFiat } = useNumbers();
const { currency } = useUserSettings();
const { isWalletReady, toggleWalletSelectModal } = useWeb3();

/**
 * COMPUTED
 */
const fiatTotal = computed(() => {
  const fiatValue = lpTokensFor(props.pool)
    .map(address => {
      let tokenBalance = '0';

      if (address === wrappedNativeAsset.value.address) {
        const wrappedBalance = balanceFor(address);
        const nativeBalance = balanceFor(nativeAsset.address);
        tokenBalance = bnum(nativeBalance).gt(wrappedBalance)
          ? nativeBalance
          : wrappedBalance;
      } else {
        tokenBalance = balanceFor(address);
      }

      return toFiat(tokenBalance, address);
    })
    .reduce((total, value) =>
      bnum(total)
        .plus(value)
        .toString()
    );

  return fNum(fiatValue, currency.value);
});

const hasUnstakedBpt = computed(
  () =>
    props.pool.farm &&
    parseFloat(balanceFor(getAddress(props.pool.address))) > 0
);

const hasFarm = computed(() => !!props.pool.farm);

const farmId = computed(() => props.pool.farm?.id || '');
const tokenAddress = computed(() => props.pool.address);
const hasFarmRewards = computed(() => props.pool.farm?.rewards || 0 > 0);

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  initMath();
});
</script>

<template>
  <BalCard>
    <div class="text-gray-500 text-sm">
      {{ $t('basedOnTokensInWallet') }}
    </div>
    <div class="flex justify-between items-center mb-4">
      <h5>{{ $t('youCanInvest') }}</h5>
      <h5>
        {{ isWalletReady ? fiatTotal : '-' }}
      </h5>
    </div>
    <BalAlert
      v-if="
        pool.id ===
          '0xdfc65c1f15ad3507754ef0fd4ba67060c108db7e000000000000000000000406'
      "
      title="Investing is currently paused"
      type="warning"
      description="We have temporarily paused deposits for this pool"
      class="mb-4"
    />

    <BalBtn
      v-if="!isWalletReady"
      :label="$t('connectWallet')"
      color="gradient"
      block
      @click="toggleWalletSelectModal"
    />
    <div v-else class="grid gap-2 grid-cols-2">
      <BalBtn
        :disabled="
          pool.id ===
            '0xdfc65c1f15ad3507754ef0fd4ba67060c108db7e000000000000000000000406'
        "
        tag="router-link"
        :to="{ name: 'invest' }"
        :label="$t('invest')"
        color="gradient"
        block
      />
      <BalBtn
        :tag="hasBpt ? 'router-link' : 'div'"
        :to="{ name: 'withdraw' }"
        :label="$t('withdraw.label')"
        :disabled="!hasBpt"
        block
      />
    </div>
  </BalCard>

  <FarmActionsCard
    v-if="hasFarm"
    :has-unstaked-bpt="hasUnstakedBpt"
    :token-address="tokenAddress"
    :farm-id="farmId"
    :has-farm-rewards="hasFarmRewards"
  />
</template>
