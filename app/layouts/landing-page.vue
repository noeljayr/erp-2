<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Bintel Analytics',
});
definePageMeta({
  title: 'Bintel Analytics',
  description: `BAL's ERP system`,
});
</script>

<style scoped></style>
