<script setup lang="ts">
import IconCircle from '~/components/svg/IconCircle.vue';
import IconLoading from '~/components/svg/IconLoading.vue';
import IconCheckFilled from '~/components/svg/IconCheckFilled.vue';
import IconPlus from '~/components/svg/IconPlus.vue';
import type { TaskTypes } from '~/types/tasksTypes';
import TaskCard from './TaskCard.vue';
import { useTaskFormData } from '#imports';

defineProps({
  title: {
    type: String,
    required: true,
  },
  taskCount: {
    type: Number,
    required: true,
  },
  tasks: {
    type: Array as () => TaskTypes[],
    required: true,
  },
});

const formData = useTaskFormData();
const tiggleModal = (title: string) => {
  openModal('new-task', 'true');
  formData.setStatus(title);
};
</script>

<template>
  <div
    class="task-column grid overflow-hidden grid-rows-[auto_1fr] gap-2 border p-2 bg-[#FAFAFA] rounded-[var(--radius)] w-full h-full"
  >
    <div class="flex items-center">
      <span class="flex space-x-2 font-p2 py-1 items-center">
        <IconCircle v-if="title === 'To-do'" class="h-4 w-4 opacity-50" />
        <IconLoading
          v-if="title === 'In Progress'"
          class="h-4 w-4 opacity-50"
        />
        <IconCheckFilled v-if="title === 'Done'" class="h-4 w-4" />
        <span class="font-medium cursor-default"> {{ title }}</span>
        <span
          class="h-5 w-5 leading-[0] cursor-default rounded-[0.35rem] text-[#A5A5A5] font-bold flex items-center justify-center font-p3 bg-[#E8E8E8] border border-[#CCCCCC]"
          >{{ taskCount }}</span
        >
      </span>

      <button @click="tiggleModal(title)" class="ml-auto opacity-50">
        <IconPlus class="h-5 w-5" />
      </button>
    </div>

    <div
      class="grid w-full auto-rows-min gap-1 overflow-y-auto rounded-[var(--radius)] hide-scrollbar"
    >
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </div>
</template>
