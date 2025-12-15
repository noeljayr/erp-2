<script setup lang="ts">
import IconCheck from "~/components/svg/IconCheck.vue";
import { AnimatePresence, motion } from "motion-v";
import { useTaskFormData } from "#imports";
import IconCircle from "~/components/svg/IconCircle.vue";
import IconLoading from "~/components/svg/IconLoading.vue";
import IconCheckFilled from "~/components/svg/IconCheckFilled.vue";

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useTaskFormData();
const selectedStatus = ref(formData.status);

function setStatus(s: string) {
  selectedStatus.value = s;
  formData.setStatus(s);
}

const statuses = ["To-do", "In Progress", "Done"];
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p2 font-medium p-1.5 pr-2.5 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconCircle
        v-if="selectedStatus === 'To-do'"
        class="h-4 w-4 mr-1 opacity-50"
      />
      <IconLoading
        v-if="selectedStatus === 'In Progress'"
        class="h-4 w-4 opacity-50 mr-1"
      />
      <IconCheckFilled v-if="selectedStatus === 'Done'" class="h-4 w-4 mr-1" />
      {{ selectedStatus ? selectedStatus : "---" }}
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
              setStatus(s);
              setShow(false);
            }
          "
          v-for="s in statuses"
          class="option w-[95%] relative flex items-center rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
        >
          <span class="opacity-75 font-medium">
            <IconCircle v-if="s === 'To-do'" class="h-4 w-4 mr-1 opacity-50" />
            <IconLoading
              v-if="s === 'In Progress'"
              class="h-4 w-4 opacity-50 mr-1"
            />
            <IconCheckFilled v-if="s === 'Done'" class="h-4 w-4 mr-1" />
          </span>
          {{ s }}
          <AnimatePresence mode="popLayout">
            <motion.span
              v-if="selectedStatus === s"
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

<style scoped></style>
