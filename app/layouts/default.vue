<template>
  <div
    class="grid grid-cols-[15rem_1fr] gap-4 w-screen h-screen overflow-hidden"
  >
    <Sidebar />
    <div class="flex w-full h-full p-4">
      <slot />
    </div>
  </div>

  <RequestFunds />
  <ViewRequestGuard />
</template>

<script setup lang="ts">
import Sidebar from '~/components/navigation/Sidebar.vue';
import RequestFunds from '~/components/modals/RequestFunds.vue';
import ViewRequestGuard from '~/components/modals/view-request/ViewRequestGuard.vue';

useSeoMeta({
  title: 'Bintel Analytics',
});
definePageMeta({
  title: 'Bintel Analytics',
  description: `BAL's ERP system`,
});
</script>

<style scoped></style>
