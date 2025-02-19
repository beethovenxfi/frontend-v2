<script setup lang="ts">
import { computed } from 'vue';
import useTokens from '@/composables/useTokens';
import useNumbers from '@/composables/useNumbers';
import useUserSettings from '@/composables/useUserSettings';
import { getAddress } from '@ethersproject/address';

/**
 * TYPES
 */
type Props = {
  address: string;
  balance: string;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { getToken } = useTokens();
const { fNum, toFiat } = useNumbers();
const { currency } = useUserSettings();

/**
 * COMPUTED
 */
const token = computed(() => getToken(props.address));

const balanceLabel = computed(() => fNum(props.balance, 'token'));

const fiatLabel = computed(() => {
  const fiatValue = toFiat(props.balance, getAddress(props.address));
  return fNum(fiatValue, currency.value);
});
</script>

<template>
  <div class="flex justify-between">
    <div class="flex flex-col">
      <span>
        {{ token.symbol }}
      </span>
      <span v-if="token.name !== token.symbol" class="text-sm text-gray-500">
        {{ token.name }}
      </span>
    </div>

    <div class="flex flex-col text-right">
      <span>
        {{ balanceLabel }}
      </span>
      <span class="text-sm text-gray-500">
        {{ fiatLabel }}
      </span>
    </div>
  </div>
</template>
