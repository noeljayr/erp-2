<script setup lang="ts">
import { motion } from 'motion-v';
import IconChevronDown from '../svg/IconChevronDown.vue';
import IconGithub from '../svg/IconGithub.vue';
import IconUsers from '../svg/IconUsers.vue';
import IconWalletClosed from '../svg/IconWalletClosed.vue';

const linksActive = ref(true);

const setLinksActive = () => {
  linksActive.value = !linksActive.value;
};

const route = useRoute();
</script>

<template>
  <motion.div
    key="erp-links"
    layout="position"
    class="flex flex-col space-y-2 my-2"
  >
    <motion.button
      @click="setLinksActive"
      layout="position"
      class="font-semibold opacity-50 px-[0.35rem] cursor-pointer w-full flex items-center"
    >
      Bintel

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
      <NuxtLink
        href="/projects"
        :class="
          route.path.startsWith('/projects')
            ? 'opacity-40 pointer-events-none'
            : 'opacity-70'
        "
      >
        <IconGithub :stroke-width="2.25" /> Projects
      </NuxtLink>

      <NuxtLink
        href="/finances"
        :class="
          route.path.startsWith('/finances')
            ? 'opacity-40 pointer-events-none'
            : 'opacity-70'
        "
      >
        <IconWalletClosed :stroke-width="2.25" /> Finances
      </NuxtLink>

      <NuxtLink
        href="#"
        :class="
          route.path.startsWith('/hr')
            ? 'opacity-40 pointer-events-none'
            : 'opacity-70'
        "
      >
        <IconUsers :stroke-width="2.25" /> Team
      </NuxtLink>
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
}

a:hover {
  filter: brightness(0.9);
}

a svg {
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>
