<script setup lang="ts">
import { motion } from 'motion-v';
import IconChevronDown from '../svg/IconChevronDown.vue';
const linksActive = ref(false);

const setLinksActive = () => {
  linksActive.value = !linksActive.value;
};
</script>

<template>
  <motion.div
    key="external-links"
    layout="position"
    class="flex flex-col space-y-2 my-2"
  >
    <motion.button
      @click="setLinksActive"
      layout="position"
      class="font-semibold opacity-50 px-[0.35rem] cursor-pointer w-full flex items-center"
    >
      External

      <IconChevronDown
        :class="`ml-auto h-3 w-3 ${
          linksActive ? 'rotate-0' : 'rotate-[-90deg]'
        }`"
      />
    </motion.button>

    <motion.div
      key="erp-links"
      layout="position"
      v-if="linksActive"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      class="space-y-1 flex flex-col"
    >
      <a href="#"> Gitbook </a>

      <a href="#"> Google Drive </a>

      <a href="#"> Zoom </a>

      <a href="#"> n8n </a>
    </motion.div>
  </motion.div>
</template>

<style scoped>
a {
  display: flex;
  align-items: center;
  font-weight: 500;
  padding: 0.35rem;
  transition: var(--transition);
  background-color: #f8f8f7;
  border-radius: var(--radius-s);
  opacity: 0.75;
  position: relative;
}

a::before{
  content: "•";
  font-weight: bold;
  opacity: 0.2;
  margin-right: 0.5rem;
  font-size: large;
}

a:hover {
  filter: brightness(0.9);
}

a img {
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
  opacity: 0.75;
}
</style>
