<script setup lang="ts">
import { computed, onMounted, ref, toRef } from 'vue';
// Types
import { FullPool } from '@/services/balancer/subgraph/types';
import { TokenInfo } from '@/types/TokenList';
// Composables
import useTokens from '@/composables/useTokens';
import useWithdrawalState from '../composables/useWithdrawalState';
import { usePool } from '@/composables/usePool';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
  initToken?: string;
};

/**
 * Props
 */
const props = withDefaults(defineProps<Props>(), {
  initToken: 'all'
});

/**
 * STATE
 */
const selectedOption = ref(props.initToken);

/**
 * COMPOSABLES
 */
const { getTokens, getToken, nativeAsset } = useTokens();
const { isProportional, tokenOut, maxSlider } = useWithdrawalState(
  toRef(props, 'pool')
);
const { isWethPool, isWeightedPoolWithNestedLinearPools } = usePool(
  toRef(props, 'pool')
);

/**
 * COMPUTED
 */
const tokenAddresses = computed(() => {
  if (props.pool?.mainTokens) return props.pool.mainTokens;
  if (isWethPool.value)
    return [nativeAsset.address, ...props.pool.tokenAddresses];
  return props.pool.tokenAddresses;
});

const tokens = computed(() => getTokens(tokenAddresses.value));

const options = computed(() => {
  if (isWeightedPoolWithNestedLinearPools.value) {
    return ['all'];
  }

  if (
    props.pool.id ===
    '0xdfc65c1f15ad3507754ef0fd4ba67060c108db7e000000000000000000000406'
  ) {
    return ['all', '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3'];
  }

  if (
    props.pool.id ===
    '0x6da14f5acd58dd5c8e486cfa1dc1c550f5c61c1c0000000000000000000003cf'
  ) {
    return ['0x846e4D51d7E2043C1a87E0Ab7490B93FB940357b'];
  }

  return ['all', ...tokenAddresses.value];
});

const selectedToken = computed((): TokenInfo => getToken(selectedOption.value));

const assetSetWidth = computed(
  () => 40 + (tokenAddresses.value.length - 2) * 10
);

/**
 * METHODS
 */
function handleSelected(newToken: string): void {
  console.log(tokenOut.value, newToken);
  if (newToken === 'all') {
    isProportional.value = true;
    selectedOption.value = 'all';
    tokenOut.value = 'all';
    maxSlider();
  } else {
    isProportional.value = false;
    selectedOption.value = newToken;
    tokenOut.value = newToken;
  }
}

onMounted(() => {
  if (
    props.pool.id ===
    '0x6da14f5acd58dd5c8e486cfa1dc1c550f5c61c1c0000000000000000000003cf'
  ) {
    handleSelected('0x846e4D51d7E2043C1a87E0Ab7490B93FB940357b');
  }
});
</script>

<template>
  <BalDropdown :options="options" minWidth="44" @selected="handleSelected">
    <template #activator>
      <div class="token-select-input selected group selectable select-none">
        <div>
          <BalAssetSet
            v-if="isProportional"
            :addresses="tokenAddresses"
            :width="50"
          />
          <BalAsset
            v-else
            :address="selectedToken.address"
            class="shadow mr-2"
          />
        </div>
        <span class="text-base font-medium">
          <span v-if="isProportional">All tokens</span>
          <span v-else>{{ selectedToken.symbol }}</span>
        </span>
        <BalIcon
          v-if="options.length > 1"
          name="chevron-down"
          size="sm"
          class="text-green-500 group-hover:text-pink-500 ml-2"
        />
      </div>
    </template>
    <template #option="{ option }">
      <div v-if="option === 'all'" class="flex items-center justify-between">
        <div class="flex items-center">
          <BalAssetSet :addresses="tokenAddresses" :width="assetSetWidth" />
          {{ $t('allTokens') }}
        </div>
        <BalIcon
          v-if="selectedOption === option"
          name="check"
          class="text-green-500 ml-2"
        />
      </div>
      <div v-else class="flex items-center justify-between">
        <div class="flex items-center">
          <BalAsset :address="option" class="mr-2" />
          {{ tokens[option]?.symbol }}
        </div>
        <BalIcon
          v-if="selectedOption === option"
          name="check"
          class="text-green-500 ml-2"
        />
      </div>
    </template>
  </BalDropdown>
</template>

<style scoped>
.token-select-input {
  @apply shadow rounded-lg flex items-center h-10 px-2 whitespace-nowrap;
  @apply text-sm;
  font-variation-settings: 'wght' 700;
}

.selectable {
  @apply cursor-pointer hover:shadow-none transition-shadow;
}

.selected {
  @apply bg-gray-50 dark:bg-gray-700 text-black dark:text-white;
}
</style>
