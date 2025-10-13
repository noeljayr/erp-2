<template>
  <span class="flex items-center justify-center">
    <svg
      :class="class"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        :stroke="
          variant === 'primary' ? 'var(--black)' : 'var(--white)'
        "
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
type Variant = 'primary' | undefined;

const props = withDefaults(
  defineProps<{
    class?: string;
    variant?: Variant;
    strokeWidth?: string | number;
  }>(),
  {
    class: '',
    strokeWidth: 2.5,
  }
);
</script>

<style scoped>
span {
  animation: spin 1s linear infinite;
}

svg path {
  stroke-dasharray: 22;
  stroke-dashoffset: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
