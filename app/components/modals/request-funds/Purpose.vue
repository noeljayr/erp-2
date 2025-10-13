<script setup lang="ts">
import IconCheck from '~/components/svg/IconCheck.vue';
import { AnimatePresence, motion } from 'motion-v';
import IconInfoSquare from '~/components/svg/IconInfoSquare.vue';
import { useRequestFormData } from '#imports';
import { purposes } from '~/constants/purposes';

const token = useAuthStore();

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useRequestFormData();
const selectedPurpose = ref(formData.purpose);

function setPurpose(p: string) {
  selectedPurpose.value = p;
  formData.setPurpose(p);
}
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border max-w-[14rem] truncate grid grid-cols-[auto_1fr] relative border-[#CFCFCF] leading-[normal] font-p3 font-medium p-1 pr-2 space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconInfoSquare class="h-4 w-4 mr-1" />
      <span class="truncate">
        {{ selectedPurpose || 'Purpose' }}
      </span>
    </button>

    <AnimatePresence>
      <motion.div
        v-if="show"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="motionTransition({ duration: 0.25 })"
        class="popup"
        style="width: 24.5rem"
      >
        <span
          class="w-full font-medium opacity-50 border-b py-2 px-4 font-p2 mb-1"
          >Purpose of the funds</span
        >
        <template v-for="purpose in purposes">
          <span
            @click="
              () => {
                setPurpose(purpose.name);
                setShow(false);
              }
            "
            v-if="
              token.role.toLowerCase() == 'employee' &&
              purpose.role != 'partners'
            "
            class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
          >
            <span class="opacity-75 font-medium">
              {{ purpose.name }}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                v-if="selectedPurpose === purpose.name"
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

          <span
            @click="
              () => {
                setPurpose(purpose.name);
                setShow(false);
              }
            "
            v-else-if="token?.role.toLowerCase() == 'partner'"
            class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
          >
            <span class="opacity-75 font-medium">
              {{ purpose.name }}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                v-if="selectedPurpose === purpose.name"
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
        </template>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped></style>
