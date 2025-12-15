<script setup lang="ts">
import IconCheck from "~/components/svg/IconCheck.vue";
import { AnimatePresence, motion } from "motion-v";
import IconCoinsSwap from "~/components/svg/IconCoinsSwap.vue";
import { useRequestFormData } from "#imports";
import IconChevronDown from "~/components/svg/IconChevronDown.vue";

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useRequestFormData();
const selectedCurrency = ref(formData.currency);

function setCurrency(curr: string) {
  selectedCurrency.value = curr;
  formData.setCurrency(curr);
}

const currencies = [
  {
    label: "Malawi Kwacha",
    value: "MWK",
  },
  {
    label: "USD Dollar",
    value: "USD",
  },
];
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p2 font-medium p-1.5 pr-2.5 flex space-x-1 items-center rounded-[0.4rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconCoinsSwap class="h-4 w-4 mr-1" />
      {{ selectedCurrency }}
      <IconChevronDown class="h-3.5 w-3.5 ml-1" />
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
          >Currency</span
        >
        <span
          @click="
            () => {
              setCurrency(currency.value);
              setShow(false);
            }
          "
          v-for="currency in currencies"
          class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
        >
          <span class="font-bold">{{ currency.value }}</span>
          <span class="opacity-75 font-medium">
            {{ currency.label }}
          </span>
          <AnimatePresence mode="popLayout">
            <motion.span
              v-if="selectedCurrency === currency.value"
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
