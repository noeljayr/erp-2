<template>
    <div class="p-4"></div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: () => {
      return navigateTo('/auth/login')
    },
  })
  </script>
  
  <style scoped></style>
  