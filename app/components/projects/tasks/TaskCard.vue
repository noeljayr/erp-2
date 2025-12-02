<script setup lang="ts">
import type { TaskTypes } from "~/types/tasksTypes";
import IconGithub from "~/components/svg/IconGithub.vue";
import IconChevronRght from "~/components/svg/IconChevronRght.vue";
import { motion } from "motion-v";
import { ref } from "vue";

const props = defineProps({
  task: {
    type: Object as () => TaskTypes,
    required: true,
  },
});

const isDragging = ref(false);

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", props.task.id);
    isDragging.value = true;
  }
};

const handleDragEnd = () => {
  isDragging.value = false;
};
</script>

<template>
  <motion.div
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :initial="{ opacity: 1, scale: 1 }"
    :animate="{
      opacity: isDragging ? 0.4 : 1,
      scale: isDragging ? 0.95 : 1,
    }"
    :whileHover="{ scale: 1.02, y: -2 }"
    :transition="{ duration: 0.2, ease: 'easeOut' }"
    :class="[
      'flex flex-col w-full space-y-2 overflow-hidden border pt-2 border-[#F0F0F0] bg-white rounded-[var(--radius)]',
      isDragging ? 'cursor-grabbing' : 'cursor-pointer',
    ]"
  >
    <div class="flex w-full items-center px-2">
      <span
        :class="`font-p3 capitalize font-semibold ${task.priority.toLowerCase()}`"
        >{{ task.priority }}</span
      >

      <span class="font-p3 ml-auto font-medium opacity-50">
        Due on {{ task.dueDate }}
      </span>
    </div>

    <div class="flex flex-col space-y-1 p-2 truncate w-full">
      <span class="font-medium truncate">{{ task.title }}</span>
      <p class="truncate font-p3 opacity-75">{{ task.description }}</p>
    </div>

    <div
      class="grid grid-cols-[1fr_auto] items-center w-full gap-4 py-2 border-t px-2"
    >
      <div class="grid grid-cols-[auto_1fr] gap-4">
        <div class="flex items-center space-x-1">
          <span
            class="h-5 w-5 text-white bg-[var(--black)] rounded-full flex items-center justify-center font-bold font-p3"
          >
            {{ task.assignee.charAt(0).toUpperCase() }}
          </span>
          <span class="font-p2 opacity-75">{{ task.assignee }}</span>
        </div>

        <div
          :title="task.repository"
          class="grid grid-cols-[auto_1fr] items-center space-x-1"
        >
          <span
            class="h-5 w-5 bg-[#F0F0F5] rounded-full flex items-center justify-center font-bold font-p3"
          >
            <IconGithub class="h-3 w-h3" />
          </span>
          <span class="font-p2 opacity-75 w-full truncate"
            >{{ task.repository }}
          </span>
        </div>
      </div>

      <button class="flex items-center opacity-50 ml-auto space-x-1">
        <span class="font-medium font-p3">Change status</span>
        <IconChevronRght class="h-3 w-3 opacity-75" />
      </button>
    </div>
  </motion.div>
</template>

<style scoped>
.urgent {
  color: var(--high);
}
.important {
  color: var(--medium);
}
.backlog {
  color: var(--low);
}
</style>
