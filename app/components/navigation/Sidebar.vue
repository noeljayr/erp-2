<script setup lang="ts">
import { AnimatePresence, MotionConfig } from 'motion-v';
import { motionTransition } from '#imports';
import Profile from './Profile.vue';

const route = useRoute();

</script>

<template>
  <div
    class="bg-[#F8F8F7] shadow-[inset_-1px_0px_0px_#EEEEEC] p-4 flex flex-col gap-4 h-full w-full"
  >
    <Profile />

    <MotionConfig :transition="motionTransition()">
      <AnimatePresence mode="popLayout">
        <NavigationFinanceLinks v-if="route.path.startsWith('/finances')" />
        <NavigationProjectsLinks v-if="route.path.startsWith('/projects')" />
        <NavigationERPLinks />
        <NavigationExternalLinks />
      </AnimatePresence>
    </MotionConfig>
  </div>
</template>

<style lang="css" scoped></style>
