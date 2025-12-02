<template>
  <div
    class="grid grid-cols-[15rem_1fr] max-[1020px]:grid-cols-1 gap-4 w-screen h-screen overflow-hidden"
  >
    <Sidebar />

    <slot />
  </div>

  <RequestFunds />
  <ViewRequestGuard />
  <AddTask />
  <AddProject />
</template>

<script setup lang="ts">
import Sidebar from '~/components/navigation/Sidebar.vue';
import RequestFunds from '~/components/modals/request-funds/RequestFunds.vue';
import ViewRequestGuard from '~/components/modals/view-request/ViewRequestGuard.vue';
import AddTask from '~/components/modals/add-task/AddTask.vue';
import AddProject from '~/components/modals/add-project/AddProject.vue';

useSeoMeta({
  title: 'Bintel Analytics',
});
definePageMeta({
  title: 'Bintel Analytics',
  description: `BAL's ERP system`,
});
</script>

<style scoped></style>
