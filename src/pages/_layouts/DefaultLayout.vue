<script setup lang="ts">
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import AppFooterNav from '@/components/navs/AppFooterNav/AppFooterNav.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import AppHeaderBg from '@/beethovenx/components/backgrounds/AppHeaderBg.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { useRoute } from 'vue-router';

/**
 * COMPOSABLES
 */
const { upToMediumBreakpoint } = useBreakpoints();
const route = useRoute();
</script>

<template>
  <div>
    <div class="banner" v-if="route.name === 'launch' || route.name === 'lge'">
      The UI for the Liquidity Bootstrapping Pools will be removed on July 31st
      2023.
    </div>
    <AppNav />
    <AppHeaderBg />
    <div class="z-10 pb-16 relative px-4 lg:px-6">
      <router-view :key="$route.path" />
    </div>
    <AppFooterNav v-if="upToMediumBreakpoint" />
    <div class="bottom-12 md:bottom-0 flex flex-col items-center relative">
      <img src="~@/beethovenx/assets/images/community-image.png" />
      <div class="absolute bottom-0 flex justify-center pb-4 xl:pb-6 xl:ml-8">
        <template
          v-for="(item, index) in EXTERNAL_LINKS.Beethoven.NavOtherItems"
          :key="index"
        >
          <BalLink :href="item.url" v-if="item.icon" external class="mx-6">
            <img
              :src="require(`@/beethovenx/assets/images/${item.icon}.png`)"
              width="40"
              class="mx-auto"
            />
          </BalLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

#intercom-activator {
  z-index: 2147483004;
}

.banner {
  @apply text-black bg-red-600 p-4 px-8 font-bold text-center;
}
</style>
