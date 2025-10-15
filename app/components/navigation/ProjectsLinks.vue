<script setup lang="ts">
import { motion } from 'motion-v';
import IconWalletOpen from '../svg/IconWalletOpen.vue';
import IconCopy from '../svg/IconCopy.vue';
import IconGithub from '../svg/IconGithub.vue';

const route = useRoute();

const token = useAuthStore();
</script>

<template>
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    key="project-links"
    layout="position"
    class="flex flex-col space-y-2"
  >
    <NuxtLink
      href="/projects/"
      :class="
        route.path.startsWith('/projects/tasks')
          ? 'text-[var(--primary)] opacity-100'
          : 'opacity-70'
      "
    >
      <IconCopy
        :stroke-width="2.25"
        :color="
          route.path.startsWith('/projects/tasks') ? '#145993cc' : '#2e2e30cc'
        "
      />
      Tasks
    </NuxtLink>

    <NuxtLink
      href="/projects/repositories"
      :class="
        route.path.startsWith('/projects/repositories')
          ? 'text-[var(--primary)] opacity-100'
          : 'opacity-70'
      "
    >
      <IconGithub
        :stroke-width="2.25"
        :color="
          route.path.startsWith('/projects/repositories')
            ? '#145993cc'
            : '#2e2e30cc'
        "
      />
      Repositories
    </NuxtLink>
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
