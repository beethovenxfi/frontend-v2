<script setup lang="ts">
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import FreshBeetsAprTooltip from '@/beethovenx/components/pages/fbeets/FreshBeetsAprTooltip.vue';
import FarmHarvestRewardsCard from '@/beethovenx/components/pages/farm/FarmHarvestRewardsCard.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { useFreshBeets } from '@/beethovenx/composables/stake/useFreshBeets';
import useNumbers from '@/composables/useNumbers';
import { computed } from 'vue';
import FarmStatCardsLoading from '@/beethovenx/components/pages/farm/FarmStatCardsLoading.vue';

const { appNetworkConfig } = useWeb3();
const { fNum } = useNumbers();

const {
  fbeetsDecoratedFarm,
  totalBptStaked,
  totalSupply,
  totalBeetsStaked,
  pool,
  fBeetsLoading,
  swapApr,
  farmApr,
  totalApr
} = useFreshBeets();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
    <template v-if="fBeetsLoading">
      <BalLoadingBlock v-for="n in 4" :key="n" class="h-24" />
    </template>
    <template v-else>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          TVL
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(fbeetsDecoratedFarm?.tvl || '0', 'usd') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          fBEETS Minted
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(totalSupply?.toString() || '0', 'token_lg') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          BEETS Staked
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(totalBeetsStaked, 'token_lg') }}
        </div>
      </BalCard>

      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          APR
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(totalApr || '0', 'percent') }}
          <FreshBeetsAprTooltip :swap-apr="swapApr" :farm-apr="farmApr" />
        </div>
      </BalCard>
    </template>
    <!--    </template>-->
  </div>
  <h4 class="px-4 lg:px-0 mb-4">Fresh BEETS Farm</h4>
  <FarmStatCardsLoading v-if="fBeetsLoading" />
  <div v-else class="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          Farm TVL
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(fbeetsDecoratedFarm?.tvl || '0', 'usd') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          BEETS
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(fbeetsDecoratedFarm?.rewards || '0', 'token_lg') }} / day
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My balance
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(fbeetsDecoratedFarm?.stake || '0', 'usd') }}
        </div>
      </BalCard>
      <BalCard>
        <div class="text-sm text-gray-500 font-medium mb-2">
          My share
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ fNum(fbeetsDecoratedFarm?.share || '0', 'percent') }}
        </div>
      </BalCard>
    </div>
    <FarmHarvestRewardsCard
      :has-beets-rewards="true"
      :farm-id="appNetworkConfig.fBeets.farmId"
      :token-address="appNetworkConfig.fBeets.poolAddress"
      :pending-beets="fbeetsDecoratedFarm?.pendingBeets || 0"
      :pending-beets-value="fbeetsDecoratedFarm?.pendingBeetsValue || 0"
      :pending-reward-token-value="0"
      :pending-reward-token="0"
    />
  </div>
</template>
