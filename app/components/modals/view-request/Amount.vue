<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { useViewRequestFormData } from "#imports";
import { motionTransition } from "#imports";


defineProps({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

const token = useAuthStore()
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

const formData = useViewRequestFormData();
const currency = ref(formData.currency);
const amount = ref<string>(formatAmount(formData.amount));

// Watch for store changes and update local refs
watch(
  () => formData.amount,
  (newAmount) => {
    amount.value = formatAmount(newAmount);
  }
);

watch(
  () => formData.currency,
  (newCurrency) => {
    currency.value = newCurrency;
  }
);

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
        class="grid grid-cols-[auto_1fr]"
      >
        <motion.span
          v-if="formData.currency == 'MWK'"
          layout="position"
          :transition="motionTransition()"
          class="font-extrabold font-h1 mr-1.5"
          >K</motion.span
        >
        <motion.span
          v-if="formData.currency == 'USD'"
          layout="position"
          :transition="motionTransition()"
          class="font-extrabold font-h1 mr-1.5"
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
          :readonly="token.user_id !== userId || status.toLowerCase() !== 'pending'"
          :class="`font-extrabold font-h1 outline-none ${token.user_id !== userId || status.toLowerCase() !== 'pending' ? 'pointer-events-none' : ''}`"
          placeholder="0.00"
        />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style lang="css" scoped></style>
