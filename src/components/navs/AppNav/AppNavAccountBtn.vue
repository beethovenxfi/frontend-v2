<template>
  <BalPopover no-pad>
    <template v-slot:activator>
      <BalBtn
        class="text-base"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loading-label="upToLargeBreakpoint ? '' : $t('connecting')"
        color="transparent"
        flat
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <img
          v-if="nftImage !== null"
          :src="nftImage"
          width="22"
          class="rounded-full h-22 w-22"
        />
        <Avatar v-else :address="account" :size="avatarSize" />
        <span
          v-text="_shorten(account)"
          class="pl-2 hidden lg:inline-block eth-address"
        />
      </BalBtn>
    </template>
    <AppNavSettings />
  </BalPopover>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import useBreakpoints from '@/composables/useBreakpoints';
import AppNavSettings from './AppNavSettings.vue';
import Avatar from '@/components/images/Avatar.vue';
import useWeb3 from '@/services/web3/useWeb3';
import useNftQuery from '@/beethovenx/composables/nft/useNftQuery';
import BalBtn from '@/components/_global/BalBtn/BalBtn.vue';

export default defineComponent({
  name: 'AppNavAccountBtn',

  components: {
    BalBtn,
    AppNavSettings,
    Avatar
  },

  setup() {
    const { bp, upToLargeBreakpoint } = useBreakpoints();
    const { isLoadingProfile, account } = useWeb3();
    const nftQuery = useNftQuery();

    const nftImage = computed(() => {
      return nftQuery.data.value || null;
    });

    const avatarSize = computed(() => {
      if (bp.value === 'sm') {
        return 35;
      } else if (['md', 'lg'].includes(bp.value)) {
        return 40;
      } else {
        return 20;
      }
    });

    return {
      // computed
      bp,
      account,
      avatarSize,
      upToLargeBreakpoint,
      isLoadingProfile,
      nftImage
    };
  }
});
</script>
