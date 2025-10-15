<script setup lang="ts">
import type { RepoTypes } from '~/types/repoTypes';
import IconCircle from '~/components/svg/IconCircle.vue';
import IconLoading from '~/components/svg/IconLoading.vue';
import IconCheckFilled from '~/components/svg/IconCheckFilled.vue';
import IconUsers from '~/components/svg/IconUsers.vue';
import IconCalendar from '~/components/svg/IconCalendar.vue';
import IconCalendarCheck from '~/components/svg/IconCalendarCheck.vue';
import { formatDate } from '#imports';

defineProps({
  repo: {
    type: Object as () => RepoTypes,
    required: true,
  },
});

const calculateProgress = (done: number, total: number) => {
  if (total === 0) return '0%';
  const progress = (done / total) * 100;
  return Math.round(progress);
};
</script>

<template>
  <div
    class="flex flex-col space-y-2 cursor-pointer bg-[#FCFCFD] py-2 border rounded-[var(--radius)]"
  >
    <div class=" items-center px-2 grid grid-cols-[1fr_auto] gap-4 truncate">
      <span class="font-medium truncate">{{ repo.title }}</span>

      <div class="flex space-x-1 ml-auto">
        <span
          class="py-1 px-2 border rounded-[0.35rem] font-p2 font-medium space-x-1 flex items-center justify-center"
        >
          <IconCircle class="h-4 w-4 opacity-50" />
          <span class="leading-[0]">
            {{ repo.todo }}
          </span>
        </span>

        <span
          class="py-1 px-2 border rounded-[0.35rem] font-p2 font-medium space-x-1 flex items-center justify-center"
        >
          <IconLoading class="h-4 w-4 opacity-50" />
          <span class="leading-[0]">
            {{ repo.inProgress }}
          </span>
        </span>

        <span
          class="py-1 px-2 border rounded-[0.35rem] font-p2 font-medium space-x-1 flex items-center justify-center"
        >
          <IconCheckFilled class="h-4 w-4" />
          <span class="leading-[0]">
            {{ repo.done }}
          </span>
        </span>
      </div>
    </div>

    <div class="flex flex-col space-y-1 w-full px-2 py-3">
      <div class="flex items-center gap-1">
        <span
          style="transition: var(--transition)"
          :style="`width: ${calculateProgress(
            repo.done,
            repo.todo + repo.inProgress + repo.done
          )}%`"
          class="bg-[var(--black)] rounded-[2rem] h-1"
        ></span>
        <span
          style="transition: var(--transition)"
          class="bg-[#EBEBEB] flex-grow rounded-[2rem] h-1"
        ></span>
      </div>
      <div class="flex items-center w-full opacity-60">
        <span class="font-p3 flex items-center space-x-1">
          {{
            calculateProgress(
              repo.done,
              repo.todo + repo.inProgress + repo.done
            )
          }}% done
        </span>

        <span class="font-p3 flex ml-auto items-center space-x-1">
          Updated {{ formatDate(repo.updatedAt) }}
        </span>
      </div>
    </div>

    <div class="flex items-center w-full pt-2 border-t px-2">
      <span class="font-p3 flex mr-auto items-center space-x-1">
        <IconUsers class="h-4 w-4 opacity-75" />
        <span class="opacity-75"> {{ repo.members }} members </span>
      </span>

      <div class="flex items-center space-x-4 font-p3 opacity-75">
        <span v-if="repo.startDate" class="flex space-x-1 items-center">
          <IconCalendar class="h-4 w-4 opacity-75" />
          <span class="leading-[0]">{{ repo.startDate }}</span>
        </span>

        <span v-if="repo.endDate" class="flex space-x-1 items-center">
          <IconCalendarCheck class="h-4 w-4 opacity-75" />
          <span class="leading-[0]">
            {{ repo.endDate }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
