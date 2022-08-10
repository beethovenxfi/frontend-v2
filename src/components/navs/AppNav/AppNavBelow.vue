<script setup lang="ts">
import useProtocolMetricsQuery from '@/beethovenx/composables/queries/useProtocolMetricsQuery';
import { computed } from 'vue';
import useNumbers from '@/composables/useNumbers';
import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import useUserPoolsData from '@/beethovenx/composables/useUserPoolsData';
import useWeb3 from '@/services/web3/useWeb3';

const { fNum } = useNumbers();
const protocolMetricsQuery = useProtocolMetricsQuery();
const { userPoolsData, userPoolDataLoading } = useUserPoolsData();
const { isWalletReady } = useWeb3();
const procotolDataLoading = computed(
  () => protocolMetricsQuery.isLoading.value
);
const tvl = computed(
  () => protocolMetricsQuery.data?.value?.totalLiquidity || 0
);
const swapFee24h = computed(
  () => protocolMetricsQuery.data?.value?.swapFee24h || 0
);
const swapVolume24h = computed(
  () => protocolMetricsQuery.data?.value?.swapVolume24h || 0
);
</script>

<template>
  <div class="bg-black">
    <div class="px-3 xl:px-6 flex items-center">
      <img
        src="~@/beethovenx/assets/images/powered-by-balancer.png"
        style="height:40px"
      />
      <div class="flex-1 items-center pl-8">
        <span class="mr-4">
          TVL:
          <BalLoadingBlock
            v-if="procotolDataLoading"
            class="w-20 h-4 inline-block"
          />
          <span v-else class="text-green-500">{{ fNum(tvl, 'usd_lg') }}</span>
        </span>
        <span class="mr-4 hidden md:inline">
          Volume (24h):
          <BalLoadingBlock
            v-if="procotolDataLoading"
            class="w-20 h-4 inline-block"
          />
          <span v-else class="text-green-500">
            {{ fNum(swapVolume24h, 'usd_lg') }}
          </span>
        </span>
        <span class="mr-4 hidden md:inline">
          Fees (24h):
          <BalLoadingBlock
            v-if="procotolDataLoading"
            class="w-16 h-4 inline-block"
          />
          <span v-else class="text-green-500">
            {{ fNum(swapFee24h, 'usd_lg') }}
          </span>
        </span>
      </div>
      <template v-if="isWalletReady">
        My Portfolio:&nbsp;<span>
          <BalLoadingBlock class="w-16 h-4" v-if="userPoolDataLoading" />
          <template v-else>
            {{ fNum(userPoolsData.totalBalanceUSD, 'usd') }}
          </template>
        </span>
      </template>
    </div>
  </div>
</template>
