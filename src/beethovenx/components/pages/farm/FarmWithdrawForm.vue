<template>
  <BalForm ref="withdrawForm" @on-submit="submit">
    <BalTextInput
      name="Withdraw"
      v-model="amount"
      v-model:isValid="validInput"
      :rules="amountRules()"
      :disabled="withdrawing"
      type="number"
      min="0"
      step="any"
      placeholder="0"
      :decimal-limit="18"
      validate-on="input"
      prepend-border
      append-shadow
    >
      <template v-slot:info>
        <div class="cursor-pointer flex" @click.prevent="amount = bptDeposited">
          {{ $t('balance') }}:
          <BalLoadingBlock v-if="dataLoading" class="h-4 w-24 ml-1" white />
          <span v-else>&nbsp;{{ bptDeposited }}</span>
        </div>
      </template>
      <template v-slot:append>
        <div class="p-2">
          <BalBtn
            size="xs"
            color="white"
            @click.prevent="amount = bptDeposited"
          >
            {{ $t('max') }}
          </BalBtn>
        </div>
      </template>
    </BalTextInput>

    <div class="pt-4">
      <BalBtn
        v-if="!isWalletReady"
        :label="$t('connectWallet')"
        block
        @click.prevent="toggleWalletSelectModal"
      />
      <template v-else>
        <BalBtn
          type="submit"
          :loading-label="dataLoading ? 'Loading' : $t('confirming')"
          color="gradient"
          :disabled="!validInput || amount === '0' || amount === ''"
          :loading="withdrawing || dataLoading"
          block
          @click="trackGoal(Goals.ClickFarmWithdraw)"
        >
          Withdraw {{ tokenName ? tokenName : 'BPT' }}
        </BalBtn>
      </template>
    </div>
  </BalForm>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { FormRef } from '@/types';
import {
  isLessThanOrEqualTo,
  isPositive,
  isRequired
} from '@/lib/utils/validations';
import { useI18n } from 'vue-i18n';
import { scale } from '@/lib/utils';
import useFathom from '@/composables/useFathom';

import { TOKENS } from '@/constants/tokens';
import useWeb3 from '@/services/web3/useWeb3';
import useTokens from '@/composables/useTokens';
import { BigNumber } from 'bignumber.js';
import useEthers from '@/composables/useEthers';
import useFarmUserQuery from '@/beethovenx/composables/farms/useFarmUserQuery';
import useFarm from '@/beethovenx/composables/farms/useFarm';

type DataProps = {
  withdrawForm: FormRef;
  amount: string;
  propMax: string[];
  validInput: boolean;
  propToken: number;
};

export default defineComponent({
  name: 'FarmWithdrawForm',
  components: {},
  emits: ['success'],

  props: {
    tokenAddress: {
      type: String,
      required: true
    },
    farmId: {
      type: String,
      required: true
    },
    tokenName: {
      type: String
    },
    dataLoading: {
      type: Boolean
    }
  },

  setup(props, { emit }) {
    const data = reactive<DataProps>({
      withdrawForm: {} as FormRef,
      amount: '',
      propMax: [],
      validInput: true,
      propToken: 0
    });

    const { txListener } = useEthers();
    const { isWalletReady, account, toggleWalletSelectModal } = useWeb3();
    const withdrawing = ref(false);
    const { t } = useI18n();
    const { tokens } = useTokens();
    const { trackGoal, Goals } = useFathom();
    const { amount } = toRefs(data);
    const { tokenAddress, farmId } = toRefs(props);
    const { withdrawAndHarvest } = useFarm(tokenAddress, farmId);
    const farmUserQuery = useFarmUserQuery(farmId.value);
    const farmUser = computed(() => {
      return farmUserQuery.data.value;
    });
    const bptDeposited = computed(() => {
      const amount = farmUser.value?.amount;

      return amount ? scale(new BigNumber(amount), -18).toString() : '0';
    });

    function amountRules() {
      return isWalletReady.value && farmUser.value
        ? [
            isPositive(),
            isLessThanOrEqualTo(bptDeposited.value, t('exceedsBalance'))
          ]
        : [isPositive()];
    }

    async function submit(): Promise<void> {
      if (!data.withdrawForm.validate()) return;

      withdrawing.value = true;
      const amountScaled = scale(new BigNumber(amount.value), 18);
      const tx = await withdrawAndHarvest(amountScaled);

      if (!tx) {
        withdrawing.value = false;
        return;
      }

      txListener(tx, {
        onTxConfirmed: async () => {
          emit('success', tx);
          amount.value = '';
          withdrawing.value = false;
        },
        onTxFailed: () => {
          withdrawing.value = false;
        }
      });
    }

    watch(isWalletReady, isAuth => {
      if (!isAuth) {
        data.amount = '0';
        data.propMax = [];
      }
    });

    return {
      // data
      ...toRefs(data),
      withdrawing,

      Goals,
      TOKENS,
      // computed
      tokens,
      amountRules,
      isWalletReady,
      toggleWalletSelectModal,
      isRequired,
      // methods
      submit,
      trackGoal,
      farmUser,
      loading: withdrawing,
      bptDeposited
    };
  }
});
</script>
