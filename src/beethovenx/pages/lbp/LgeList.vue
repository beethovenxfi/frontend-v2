<script setup lang="ts">
import LgeTable from '@/beethovenx/lbp/components/LgeTable.vue';
import LgeListWarning from '@/beethovenx/lbp/components/LgeListWarning.vue';
</script>
<template>
  <div class="lg:container lg:mx-auto pt-10 md:pt-12">
    <div class="flex mb-3 items-center">
      <div class="flex-1">
        <img src="~@/beethovenx/assets/images/auctions.svg" class="-ml-4" />
      </div>
    </div>
    <LgeListWarning />
    <div class="mb-32">
      <LgeTable />
    </div>
  </div>
</template>
