<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { useRequestFormData } from "#imports";
import { motionTransition } from "#imports";

const formData = useRequestFormData();
const currency = ref(formData.currency);

// Function to format number with commas
function formatAmount(value: number): string {
  if (value < 1) return "";

  const valueStr = value.toString();
  const [integerPart, decimalPart] = valueStr.split(".");
  const formattedInteger =
    integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "";

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

const amount = ref<string>(formatAmount(formData.amount));

function onInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let rawValue = input.value;

  rawValue = rawValue.replace(/[^0-9.]/g, "");

  const parts = rawValue.split(".");
  if (parts.length > 2) {
    rawValue = parts[0] + "." + parts.slice(1).join("");
  }

  const [integerPart, decimalPart] = rawValue.split(".");
  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedValue =
    decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;

  input.value = formattedValue || "";
  amount.value = formattedValue || "";

  if (rawValue.length > 0) {
    formData.setAmount(parseFloat(rawValue));
  } else {
    formData.setAmount(0);
    input.value = "";
    amount.value = "";
  }
}
</script>

<template>
  <div class="funds-input flex flex-col gap-2 select-none">
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        :transition="motionTransition()"
        class="grid grid-cols-[auto_1fr]  p-2 bg-gray-50 border border-black/10 rounded-[var(--radius-m)]"
      >
        <motion.span
          v-if="formData.currency == 'MWK'"
          layout="position"
          :transition="motionTransition()"
          class="font-extrabold font-h2 mr-1.5"
          >K</motion.span
        >
        <motion.span
          v-if="formData.currency == 'USD'"
          layout="position"
          :transition="motionTransition()"
          class="font-extrabold font-h2 mr-1.5"
          >$</motion.span
        >
        <input
          layout="position"
          :transition="motionTransition()"
          type="text"
          :value="amount"
          @beforeinput="onInput"
          @keydown="onInput"
          @input="onInput"
          class="font-extrabold font-h2 bg-transparent outline-none"
          placeholder="0.00"
        />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style lang="css" scoped></style>
