<script setup lang="ts">
import ProjectsHeader from '~/components/projects/ProjectsHeader.vue';
import ProjectCard from '~/components/projects/repos/ProjectCard.vue';
import type { RepoTypes } from '~/types/repoTypes';

const repos: RepoTypes[] = [
  {
    title: 'BEMS-UI',
    todo: 2,
    inProgress: 3,
    done: 10,
    members: 2,
    startDate: '14 May 2024',
    endDate: '21 Sept 2025',
    updatedAt: '2025-07-12T15:43:28Z',
  },
  {
    title: 'Bintel ERP',
    todo: 0,
    inProgress: 15,
    done: 2,
    members: 1,
    startDate: '5 June 2025',
    endDate: '31 Oct 2025',
    updatedAt: '2025-10-03T09:17:45Z',
  },
  {
    title: 'Auth System',
    todo: 0,
    inProgress: 1,
    done: 12,
    members: 3,
    startDate: '14 May 2024',
    endDate: '21 Sept 2025',
    updatedAt: '2025-09-01T22:11:09Z',
  },
  {
    title: 'HR system',
    todo: 15,
    inProgress: 0,
    done: 0,
    members: 0,
    startDate: '14 May 2024',
    endDate: '21 Sept 2025',
    updatedAt: '2024-12-18T08:25:34Z',
  },
  {
    title: 'Auth System',
    todo: 0,
    inProgress: 1,
    done: 12,
    members: 3,
    startDate: '14 May 2024',
    endDate: '21 Sept 2025',
    updatedAt: '2025-08-22T12:54:02Z',
  },
  {
    title: 'Payments API',
    todo: 0,
    inProgress: 15,
    done: 2,
    members: 1,
    startDate: null,
    endDate: null,
    updatedAt: '2025-06-09T04:31:50Z',
  },
];
</script>

<template>
  <div
    class="grid grid-rows-[auto_1fr] w-full gap-4 p-4 overflow-hidden h-full"
  >
    <ProjectsHeader />
    <div
      class="grid auto-rows-min w-full h-full gap-4 overflow-hidden grid-cols-3 min-[1440px]:grid-cols-4"
    >
      <ProjectCard v-for="repo in repos" :repo="repo" />
    </div>
  </div>
</template>

<style scoped></style>
