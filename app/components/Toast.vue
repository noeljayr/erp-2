<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { motionTransition } from "#imports";
import IconX from "~/components/svg/IconX.vue";
import { useToast } from "~/composables/useToast";

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="toast-container">
    <AnimatePresence mode="popLayout">
      <motion.div
        v-for="toast in toasts"
        :key="toast.id"
        :initial="{ opacity: 0, y: 20, scale: 0.95 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, scale: 0.95, y: 10 }"
        :transition="motionTransition({ duration: 0.25 })"
        :class="['toast', `toast-${toast.type}`]"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button
          @click="removeToast(toast.id)"
          class="toast-close"
          aria-label="Close"
        >
          <IconX :strokeWidth="2" class="h-3 w-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background-color: white;
  border: 1px solid var(--border-2);
  border-radius: var(--radius-s);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 16rem;
  max-width: 24rem;
}

.toast-message {
  flex: 1;
  font-size: var(--p2);
  font-weight: 500;
  color: var(--black);
}



.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  border-radius: var(--radius-xs);
  transition: var(--transition);
}

.toast-close:hover {
  opacity: 1;
  background-color: var(--input-bg);
}
</style>
