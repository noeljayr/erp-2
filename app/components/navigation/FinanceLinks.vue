
<script setup lang="ts">
import { motion } from 'motion-v';
import IconChart from '../svg/IconChart.vue';;
import IconWalletOpen from '../svg/IconWalletOpen.vue';

const route = useRoute();

const token = useAuthStore()
</script>



<template>
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    key="finance-links"
    layout="position"
    class="flex flex-col space-y-2"
  >
    <NuxtLink
      href="/finances/analytics"
      v-if="token.role === 'Partner'"
      :class="
        route.path.startsWith('/finances/analytics')
          ? 'text-[var(--primary)] opacity-100'
          : 'opacity-70'
      "
    >
      <IconChart
        :stroke-width="2.25"
        :color="
          route.path.startsWith('/finances/analytics')
            ? '#145993cc'
            : '#2e2e30cc'
        "
      />
      Analytics
    </NuxtLink>

    <NuxtLink
      href="/finances/requests"
      :class="
        route.path.startsWith('/finances/requests')
          ? 'text-[var(--primary)] opacity-100'
          : 'opacity-70'
      "
    >
      <IconWalletOpen
        :stroke-width="2.25"
        :color="
          route.path.startsWith('/finances/requests')
            ? '#145993cc'
            : '#2e2e30cc'
        "
      />
      Requests
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
