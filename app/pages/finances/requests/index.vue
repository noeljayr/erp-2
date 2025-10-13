<template>
  <div class="flex flex-col w-full gap-4">
    <RequestsHeader />
    <Toolbar />
    <RequestsTable />
  </div>
</template>

<script setup lang="ts">
import RequestsHeader from '~/components/requests/RequestsHeader.vue';
import Toolbar from '~/components/requests/Toolbar.vue';
import RequestsTable from '~/components/RequestsTable.vue';
</script>

<style scoped></style>
