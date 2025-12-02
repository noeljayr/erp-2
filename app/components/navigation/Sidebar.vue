<script setup lang="ts">
import { AnimatePresence, MotionConfig } from 'motion-v';
import { motionTransition } from '#imports';
import Profile from './Profile.vue';

const route = useRoute();

const { isOpen: open } = useUrlModal('sidebar');

</script>

<template>
  <div v-if="open" @click="closeModal('sidebar')" class="fixed hidden  max-[1020px]:flex w-screen h-screen z-20 bg-black opacity-25"></div>
  <div
    style="transition: var(--transition);"
    :class="`bg-[#F8F8F7]  max-[1020px]:fixed max-[1020px]:z-30 max-[1020px]:w-[15rem]  ${open ? 'max-[1020px]:left-0' : 'max-[1020px]:left-[-75vw]'} shadow-[inset_-1px_0px_0px_#EEEEEC] p-4 flex flex-col gap-4 h-full w-full`"
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
