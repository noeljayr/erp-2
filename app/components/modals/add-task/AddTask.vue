<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v';
import { motionTransition, closeModal } from '#imports';
import IconCopy from '~/components/svg/IconCopy.vue';
import IconChevronRght from '~/components/svg/IconChevronRght.vue';
import IconX from '~/components/svg/IconX.vue';
import Description from './Description.vue';
import Priority from './Priority.vue';
import DueDate from './DueDate.vue';
import Assignee from './Assignee.vue';
import Status from './Status.vue';
import Repo from './Repo.vue';
import { useTaskFormData } from '#imports';

const { isOpen: open } = useUrlModal('new-task');
const formData = useTaskFormData();

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

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const newValue = target.value;
  formData.setTitle(newValue);
}
</script>

<template>
  <AnimatePresence mode="popLayout">
    <div
      v-if="open"
      @click="closeModal('new-task')"
      class="absolute z-20 left-0 top-0 w-screen h-screen bg-black opacity-30"
    ></div>
    <motion.form
      :initial="{ opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionTransition({ duration: 0.25 })"
      v-if="open"
      class="fixed z-30 self-center justify-self-center border border-[#D2D2D2] w-[40%] max-[1440px]:w-[55%] top-[1rem] rounded-[0.5rem] bg-white"
    >
      <div class="flex w-full items-center px-4 pt-2 pb-2 border-b">
        <div class="flex items-center space-x-2">
          <IconCopy class="h-4 w-4 opacity-75" />
          <IconChevronRght class="h-4 w-4 opacity-50" />
          <span class="font-medium"> New task </span>
        </div>

        <span
          @click="closeModal('new-task')"
          style="transition: var(--transition)"
          class="bg-white h-[1.75rem] w-[1.75rem] rounded-[0.35rem] cursor-pointer hover:brightness-90 flex items-center justify-center ml-auto"
        >
          <IconX strokeWidth="2" class="h-4 w-4" />
        </span>
      </div>

      <div class="p-4 flex flex-col">
        <input
          :value="formData.title"
          @input="handleInput"
          type="text"
          class="font-extrabold font-h2 outline-none border-0 bg-transparent"
          placeholder="Title"
        />
        <Description />
      </div>

      <div class="flex w-full items-center px-4 pt-2 pb-2 border-t">
        <div class="flex items-center space-x-2">
          <Status />
          <Priority />
          <Assignee />
          <Repo />
          <DueDate />
        </div>

        <button
          :disabled="!formData.validateFormData()"
          :class="`cta ml-auto disabled:cursor-not-allowed ${
            loading ? 'opacity-50 pointer-events-none' : ''
          }`"
        >
          Creat task
        </button>
      </div>
    </motion.form>
  </AnimatePresence>
</template>

<style scoped></style>
