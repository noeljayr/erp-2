<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { motionTransition, closeModal } from "#imports";
import IconWalletOpen from "~/components/svg/IconWalletOpen.vue";
import IconChevronRght from "~/components/svg/IconChevronRght.vue";
import IconX from "~/components/svg/IconX.vue";
import Amount from "./Amount.vue";
import Description from "./Description.vue";
import Currency from "./Currency.vue";
import Purpose from "./Purpose.vue";
import Approver from "./Approver.vue";
import DateRequired from "./DateRequired.vue";
import { useRequestFormData } from "#imports";
import { requestFunds } from "~/api-calls/requests";

const { isOpen: open } = useUrlModal("new-request");
const formData = useRequestFormData();

const loading = ref(false);
const setLoading = (val: boolean) => {
  loading.value = val;
};
const error = ref(false);
const setError = (val: boolean) => {
  error.value = val;
};
const success = ref(false);
const setSuccess = (val: boolean) => {
  success.value = val;
};

const { showToast } = useToast();

const submit = (e: Event) => {
  e.preventDefault();
  requestFunds({
    setLoading,
    setError,
    setSuccess: (val: boolean) => {
      setSuccess(val);
      if (val) {
        showToast("Funds request submitted successfully", "success");
      }
    },
    setStatusMessage: () => {},
  });
};
</script>

<template>
  <AnimatePresence mode="popLayout">
    <div
      v-if="open"
      @click="closeModal('new-request')"
      class="absolute z-20 left-0 top-0 w-screen h-screen bg-black opacity-30"
    ></div>
    <motion.form
      @submit="submit"
      :initial="{ opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionTransition({ duration: 0.25 })"
      v-if="open"
      class="fixed z-30 self-center justify-self-center border border-[#D2D2D2] w-[40%] max-[1440px]:w-[55%] top-[1rem] rounded-[0.5rem] bg-white"
    >
      <div class="flex w-full items-center px-4 pt-2 pb-2 border-b">
        <div class="flex items-center space-x-2">
          <IconWalletOpen class="h-4 w-4 opacity-75" />
          <IconChevronRght class="h-4 w-4 opacity-50" />
          <span class="font-medium"> New funds request </span>
        </div>

        <span
          @click="closeModal('new-request')"
          style="transition: var(--transition)"
          class="bg-white h-[1.75rem] w-[1.75rem] rounded-[0.35rem] cursor-pointer hover:brightness-90 flex items-center justify-center ml-auto"
        >
          <IconX strokeWidth="2" class="h-4 w-4" />
        </span>
      </div>

      <div class="p-4 flex flex-col space-y-2">
        <Amount />
        <Description />

        <div class="flex items-center  space-x-2">
          <Currency />

          <Purpose />

          <Approver />

          <DateRequired />
        </div>
      </div>

      <div class="flex w-full items-center px-4 pt-2 pb-2 border-t">
        <button
          :disabled="!formData.validateFormData()"
          :class="`cta ml-auto disabled:cursor-not-allowed ${
            loading ? 'opacity-50 pointer-events-none' : ''
          }`"
        >
          Submit
        </button>
      </div>
    </motion.form>
  </AnimatePresence>
</template>

<style scoped></style>
