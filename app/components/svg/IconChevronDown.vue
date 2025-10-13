<template>
  <svg
    class=""
    :class="class"
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  class: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'rgba(46, 46, 48, 0.8)',
  },
  strokeWidth: {
    type: [String, Number],
    default: '2',
  },
});
</script>

<style scoped></style>
