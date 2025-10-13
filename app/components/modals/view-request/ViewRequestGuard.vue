<template>
  <div>
    <ViewRequest v-if="open" />
  </div>
</template>

<script setup lang="ts">
import ViewRequest from './ViewRequest.vue';
const { isOpen: open } = useUrlModal('view-request');
</script>

<style scoped></style>
