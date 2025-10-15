<script setup lang="ts">
import IconCheck from '~/components/svg/IconCheck.vue';
import { AnimatePresence, motion } from 'motion-v';
import { useTaskFormData } from '#imports';
import IconGithub from '~/components/svg/IconGithub.vue';


const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useTaskFormData();
const repo = ref<string | null>(null);

function setRepo(r: string) {
  repo.value = r;
  formData.setRepo(r);
}




</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p3 font-medium p-1 pr-2 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconGithub class="h-4 w-4 mr-1" />
      {{ repo ? repo: 'Repository' }}
    </button>

    <AnimatePresence>
      <motion.div
        v-if="show"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="motionTransition({ duration: 0.25 })"
        class="popup"
      >
        <span
          class="w-full font-medium opacity-50 border-b py-2 px-4 font-p2 mb-1"
          >Repository the task belongs to</span
        >
        
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped></style>
