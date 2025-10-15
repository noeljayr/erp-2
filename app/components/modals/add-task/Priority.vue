<script setup lang="ts">
import IconCheck from '~/components/svg/IconCheck.vue';
import { AnimatePresence, motion } from 'motion-v';
import IconCoinsSwap from '~/components/svg/IconCoinsSwap.vue';
import { useTaskFormData } from '#imports';

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useTaskFormData();
const selectedPriority = ref(formData.priority);

function setPriority(p: string) {
  selectedPriority.value = p;
  formData.setPriority(p);
}

const priorities = ['urgent', 'important', 'backlog'];
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] capitalize leading-[normal] font-p3 font-medium p-1 pr-2 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <span class="h-4 w-4 mr-1 flex items-center justify-center">
        <span
          v-if="selectedPriority"
          :class="`h-2 w-2 rounded-full ${selectedPriority}`"
        ></span>
        <span v-else class="h-2 w-2 rounded-full aspect-square bg-gray-300"></span>
      </span>
      {{ selectedPriority ? selectedPriority : 'Priority' }}
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
          >Priority</span
        >
        <span
          @click="
            () => {
              setPriority(p);
            setShow(false);
            }
          "
          v-for="p in priorities"
          class="option w-[95%] flex items-center capitalize relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
        >
          <span class=" font-medium capitalize flex items-center">
            <span class="h-4 w-4 mr-1 flex items-center justify-center">
              <span :class="`h-2 w-2 rounded-full ${p}`"></span>
            </span>
          </span>
          {{ p }}
          <AnimatePresence mode="popLayout">
            <motion.span
              v-if="selectedPriority === p"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0 }"
              :transition="motionTransition({ duration: 0.15 })"
              class="absolute right-0"
            >
              <IconCheck stroke="2" class="h-4 w-4" />
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.urgent {
  background-color: var(--high);
}
.important {
  background-color: var(--medium);
}
.backlog {
  background-color: var(--low);
}
</style>
