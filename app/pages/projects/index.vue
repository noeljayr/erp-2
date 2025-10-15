<template>
  <div class="p-4"></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => {
    return navigateTo('/projects/tasks')
  },
})
</script>

<style scoped></style>
