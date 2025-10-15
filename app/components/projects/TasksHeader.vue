<script setup lang="ts">
import IconCopy from '../svg/IconCopy.vue';
import IconChevronDown from '../svg/IconChevronDown.vue';
import IconGithub from '../svg/IconGithub.vue';
import IconPlus from '../svg/IconPlus.vue';

</script>

<template>
  <div class="w-full items-center flex">
    <div class="w-fit flex items-center space-x-4">
      <span class="font-medium opacity-75">Tasks</span>
      <div class="flex gap-2 items-center">
        <button
          :class="[
            'border font-p3  font-medium p-1 px-2 space-x-1 flex items-center rounded-[0.3rem] transition-all duration-150 bg-[#E7E7E4] border-[#C7C7C7]',
          ]"
        >
          <IconCopy class="h-4 w-4" />

          <span class="font-semibold leading-[normal] cursor-default"
            >All Tasks</span
          >
        </button>

        <button
          style="transition: var(--transition)"
          :class="[
            ' font-p3 opacity-50 cursor-pointer border border-white font-medium p-1 px-2 space-x-1 flex items-center rounded-[0.3rem] transition-all duration-150 bg-white hover:brightness-95 hover:opacity-100',
          ]"
        >
          <IconGithub class="h-4 w-4" />

          <span class="font-semibold leading-[normal]"
            >Project</span
          >
          <IconChevronDown class="h-3 w-3 opacity-75" />
        </button>
      </div>
    </div>

    <button
    @click="openModal('new-task', 'true')"
      class="cursor-pointer ml-auto border border-white font-p2 font-medium p-1 px-2 space-x-1 flex items-center rounded-[0.3rem] transition-all duration-150 bg-white hover:brightness-95 hover:opacity-100"
    >
      <IconPlus class="h-4 w-4" />
      <span>New task</span>
    </button>
  </div>
</template>

<style scoped></style>
