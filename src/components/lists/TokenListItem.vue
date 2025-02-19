<template>
  <div
    ref="animateRef"
    class="flex py-3 px-4 highlight items-center leading-5 text-base opacity-0"
  >
    <BalAsset
      :address="token.address"
      :iconURI="token.logoURI"
      :size="34"
      class="mr-3"
    />
    <div class="flex-auto">
      {{ token.symbol }}
      <BalTooltip
        v-if="isWalletReady"
        placement="right"
        :width="32"
        @click.stop="addTokenToWallet(token)"
      >
        <template v-slot:activator>
          <BalIcon name="plus-circle" size="xs" class="ml-1" />
        </template>
        <div class="text-sm bg-gray-50 dark:bg-gray-800 rounded-t">
          Add token to wallet
        </div>
      </BalTooltip>
      <div class="text-gray text-sm w-20 md:w-40 truncate">
        {{ token.name }}
      </div>
    </div>

    <span class="flex flex-col items-end text-right font-medium ml-auto">
      <BalLoadingNumber v-if="balanceLoading" type="token" />
      <template v-else>
        <template v-if="balance > 0">
          <template v-if="balance >= 0.0001">
            {{ fNum(balance, 'token') }}
          </template>
          <template v-else>
            &#60; 0.0001
          </template>
        </template>
        <template v-else>-</template>
      </template>

      <BalLoadingNumber
        v-if="balanceLoading"
        type="fiat"
        numberWidth="2"
        numberHeight="4"
        class="text-sm font-normal"
      />
      <div v-else class="text-gray-500 text-sm font-normal">
        <template v-if="value > 0">
          {{ fNum(value, 'usd') }}
        </template>
        <template v-else>-</template>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import useNumbers from '@/composables/useNumbers';
import anime from 'animejs';
import { onMounted, onUnmounted, PropType, ref, computed } from 'vue';
import { TokenInfo } from '@/types/TokenList';
import useTokens from '@/composables/useTokens';
import useUserSettings from '@/composables/useUserSettings';
import useWeb3 from '@/services/web3/useWeb3';

export default {
  name: 'TokenListItem',

  props: {
    token: { type: Object as PropType<TokenInfo>, required: true },
    balanceLoading: { type: Boolean, default: true }
  },

  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum } = useNumbers();
    const animateRef = ref();
    const { balances, prices } = useTokens();
    const { currency } = useUserSettings();
    const { isWalletReady, addTokenToWallet } = useWeb3();

    /**
     * COMPUTED
     */
    const balance = computed(() => Number(balances.value[props.token.address]));
    const price = computed(() =>
      prices.value[props.token.address]
        ? prices.value[props.token.address][currency.value]
        : 0
    );
    const value = computed(() => balance.value * price.value);

    /**
     * CALLBACKS
     */
    onMounted(() => {
      anime({
        opacity: 1,
        targets: animateRef.value,
        delay: anime.stagger(100)
      });
    });

    onUnmounted(() => {
      anime({
        opacity: 0,
        targets: animateRef.value
      });
    });

    return {
      fNum,
      animateRef,
      balance,
      value,
      isWalletReady,
      addTokenToWallet
    };
  }
};
</script>
