<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { TransactionActionInfo } from '@/types/transactions';
import useWeb3 from '@/services/web3/useWeb3';
import useConfig from '@/composables/useConfig';
import useTokenApprovalActions from '@/composables/useTokenApprovalActions';
import usePoolCreation from '@/composables/pools/usePoolCreation';
import BalActionSteps from '@/components/_global/BalActionSteps/BalActionSteps.vue';
import useEthers from '@/composables/useEthers';

/**
 * TYPES
 */
type Props = {
  tokenAddresses: string[];
  amounts: string[];
};

type CreateState = {
  confirmed: boolean;
  confirmedAt: string;
  receipt?: TransactionReceipt;
  isRestoredTxConfirmed?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

/**
 * STATE
 */
const createState = reactive<CreateState>({
  confirmed: false,
  confirmedAt: '',
  isRestoredTxConfirmed: false
});

/*
 * COMPOSABLES
 */
// const route = useRoute();
const { t } = useI18n();
const { explorerLinks } = useWeb3();
const { networkConfig } = useConfig();
const { isTxConfirmed } = useEthers();
const { tokenApprovalActions } = useTokenApprovalActions(
  props.tokenAddresses,
  ref(props.amounts)
);
const {
  createPool,
  joinPool,
  poolId,
  poolTypeString,
  hasRestoredFromSavedState,
  needsSeeding,
  createPoolTxHash
} = usePoolCreation();

/**
 * COMPUTED
 */
const actions = computed((): TransactionActionInfo[] => [
  ...tokenApprovalActions,
  {
    label: t('createPool'),
    loadingLabel: t('investment.preview.loadingLabel.create'),
    confirmingLabel: t('confirming'),
    action: createPool,
    stepTooltip: t('createPoolTooltip', [poolTypeString.value])
  },
  {
    label: t('fundPool'),
    loadingLabel: t('investment.preview.loadingLabel.fund'),
    confirmingLabel: t('confirming'),
    action: joinPool,
    stepTooltip: t('fundPoolTooltip')
  }
]);

const requiredActions = computed(() => {
  if (
    (hasRestoredFromSavedState.value && needsSeeding.value) ||
    createState.isRestoredTxConfirmed
  ) {
    return actions.value.filter(action => action.label === t('fundPool'));
  }
  return actions.value;
});

const explorerLink = computed((): string =>
  createState.receipt
    ? explorerLinks.txLink(createState.receipt.transactionHash)
    : ''
);

onMounted(async () => {
  if (createPoolTxHash.value) {
    const isConfirmed = await isTxConfirmed(createPoolTxHash.value);
    createState.isRestoredTxConfirmed = isConfirmed;
  }
});

/**
 * METHODS
 */
function handleSuccess(details: any): void {
  createState.confirmed = true;
  createState.receipt = details.receipt;
  createState.confirmedAt = details.confirmedAt;
  emit('success');
}
</script>

<template>
  <div>
    <BalActionSteps :actions="requiredActions" @success="handleSuccess" />
    <template v-if="createState.confirmed">
      <div
        class="flex items-center justify-between text-gray-400 dark:text-gray-600 mt-4 text-sm"
      >
        <div class="flex items-center">
          <BalIcon name="clock" />
          <span class="ml-2">
            {{ createState.confirmedAt }}
          </span>
        </div>
        <BalLink
          :href="explorerLink"
          external
          noStyle
          class="group flex items-center"
        >
          {{ networkConfig.explorerName }}
          <BalIcon
            name="arrow-up-right"
            size="sm"
            class="ml-px group-hover:text-pink-500 transition-colors"
          />
        </BalLink>
      </div>
      <BalBtn
        tag="router-link"
        :to="{ name: 'pool', params: { id: poolId } }"
        color="gray"
        outline
        block
        class="mt-2"
      >
        {{ $t('viewPool') }}
      </BalBtn>
    </template>
  </div>
</template>
