<script setup lang="ts">
import IconCircle from "~/components/svg/IconCircle.vue";
import IconLoading from "~/components/svg/IconLoading.vue";
import IconCheckFilled from "~/components/svg/IconCheckFilled.vue";
import IconPlus from "~/components/svg/IconPlus.vue";
import type { TaskTypes } from "~/types/tasksTypes";
import TaskCard from "./TaskCard.vue";
import { useTaskFormData } from "#imports";
import { ref } from "vue";
import { motion } from "motion-v";

const props = defineProps({
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

const emit = defineEmits(["update-task-status"]);

const formData = useTaskFormData();
const tiggleModal = (title: string) => {
  openModal("new-task", "true");
  formData.setStatus(title);
};

const isDragOver = ref(false);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;

  // Only set isDragOver to false if we're actually leaving the element
  if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
    isDragOver.value = false;
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;

  const taskId = e.dataTransfer?.getData("taskId");
  if (taskId) {
    emit("update-task-status", taskId, props.title);
  }
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

    <motion.div
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :animate="{
        backgroundColor: isDragOver
          ? 'rgba(219, 234, 254, 0.5)'
          : 'transparent',
      }"
      :transition="{ duration: 0.2, ease: 'easeOut' }"
      :class="[
        'grid w-full auto-rows-min gap-1 overflow-y-auto rounded-[var(--radius)] hide-scrollbar',
        isDragOver ? 'border-2 border border-dashed' : '',
      ]"
    >
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </motion.div>
  </div>
</template>
