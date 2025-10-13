<template>
  <svg
    :class="class"
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
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
