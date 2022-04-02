<script setup lang="ts">
import { computed, ref } from 'vue';
import useNumbers from '@/composables/useNumbers';
import numeral from 'numeral';
import useEthers from '@/composables/useEthers';
import useBreakpoints from '@/composables/useBreakpoints';
import useUserPoolData from '@/beethovenx/composables/useUserPoolData';
import useUserPendingRewards from '@/beethovenx/composables/useUserPendingRewards';
import { masterChefContractsService } from '@/beethovenx/services/farm/master-chef-contracts.service';
import useWeb3 from '@/services/web3/useWeb3';
import useTransactions from '@/composables/useTransactions';

const { txListener } = useEthers();
const { fNum } = useNumbers();
const { userPoolDataLoading, userPoolData } = useUserPoolData();
const {
  userPendingRewardsQuery,
  userPendingRewards,
  userPendingRewardsLoading
} = useUserPendingRewards();
const { getProvider, appNetworkConfig, account } = useWeb3();
const { addTransaction } = useTransactions();

const harvesting = ref(false);
const { upToLargeBreakpoint } = useBreakpoints();

const hasFarmRewards = computed(
  () => parseFloat(userPendingRewards.value.farm.totalBalanceUSD) > 0
);

async function harvestAllFarms(farmIds: string[]) {
  try {
    const provider = getProvider();
    const tx = await masterChefContractsService.masterChef.harvestAll(
      provider,
      farmIds,
      account.value
    );

    addTransaction({
      id: tx.hash,
      type: 'tx',
      action: 'claim',
      summary: 'Harvest all rewards',
      details: {
        spender: appNetworkConfig.addresses.masterChef
      }
    });

    return tx;
  } catch (error) {
    console.error(error);
  }
}

async function harvestAllRewards(): Promise<void> {
  harvesting.value = true;
  const tx = await harvestAllFarms(userPendingRewards.value.farm.farmIds);

  if (!tx) {
    harvesting.value = false;
    return;
  }

  txListener(tx, {
    onTxConfirmed: async () => {
      await userPendingRewardsQuery.refetch.value();
      harvesting.value = false;
    },
    onTxFailed: () => {
      harvesting.value = false;
    }
  });
}
</script>

<template>
  <BalPopover no-pad>
    <template v-slot:activator>
      <BalBtn
        color="transparent"
        flat
        class="mr-2 text-base"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <StarsIcon
          :class="{ 'mr-2': !upToLargeBreakpoint }"
          v-if="
            upToLargeBreakpoint
              ? !(userPoolDataLoading && userPendingRewardsLoading)
              : true
          "
        />
        <BalLoadingIcon
          size="sm"
          v-if="harvesting || userPoolDataLoading || userPendingRewardsLoading"
        />
        <span class="hidden lg:block" v-else>
          {{ fNum(userPendingRewards.farm.totalBalanceUSD, 'usd') }}
        </span>
      </BalBtn>
    </template>
    <div class="w-80 sm:w-96">
      <h5 class="text-lg mb-3 px-3 pt-3">
        Farm Incentives
      </h5>
      <BalCard class="mx-2 mb-2">
        <div class="text-sm text-gray-500 font-medium mb-2 text-left">
          Pending Rewards
        </div>
        <template
          v-for="(token, idx) in userPendingRewards.farm.tokens"
          :key="idx"
        >
          <div class="text-xl font-medium truncate flex items-center">
            {{ numeral(token.balance).format('0,0.[0000]') }}
            {{ token.symbol }}
          </div>
        </template>
        <div class="text-sm text-gray-500 font-medium mt-1 text-left">
          {{ fNum(userPendingRewards.farm.totalBalanceUSD, 'usd') }}
        </div>
      </BalCard>
      <div class="grid grid-cols-2 gap-x-2 gap-y-2 px-2">
        <BalCard class="">
          <div class="text-sm text-gray-500 font-medium mb-2 text-left">
            Total Deposit
          </div>
          <div class="text-xl font-medium truncate flex items-center">
            {{ fNum(userPoolData.totalFarmBalanceUSD, 'usd') }}
          </div>
          <div class="text-sm text-gray-500 font-medium mt-1 text-left">
            {{ userPendingRewards.farm.numFarms }}
            {{
              parseInt(userPendingRewards.farm.numFarms) === 1
                ? 'Farm'
                : 'Farms'
            }}
          </div>
        </BalCard>
        <BalCard>
          <div class="text-sm text-gray-500 font-medium mb-2 text-left">
            Average APR
          </div>
          <div class="text-xl font-medium truncate flex items-center">
            {{ fNum(userPoolData.averageFarmApr, 'percent') }}
          </div>
          <div class="text-sm text-gray-500 font-medium mt-1 text-left">
            {{ fNum(parseFloat(userPoolData.averageFarmApr) / 365, 'percent') }}
            Daily
          </div>
        </BalCard>
      </div>
      <div class="mx-2 mb-2 mt-2">
        <BalBtn
          type="submit"
          loading-label="Harvesting"
          :disabled="!hasFarmRewards"
          :loading="harvesting"
          @click="harvestAllRewards"
          class="w-full"
        >
          Harvest All Rewards
        </BalBtn>
      </div>
    </div>
  </BalPopover>
</template>
