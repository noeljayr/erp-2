<script setup lang="ts">
import TasksHeader from '~/components/projects/TasksHeader.vue';
import TaskColumn from '~/components/projects/tasks/TaskColumn.vue';
import type { TaskTypes } from '~/types/tasksTypes';
import { computed } from 'vue';

const tasks : TaskTypes[] = [
  {
    id: "performance-optimization-urgent-1",
    title: "Performance Optimization",
    status: "To-do",
    priority: "Urgent",
    dueDate: "20 April",
    description: "Quickly resolve slow API response times & Database queries.",
    assignee: "Noel",
    repository: "bems-ui"
  },
  {
    id: "performance-optimization-backlog-2",
    title: "Performance Optimization",
    status: "To-do",
    priority: "Backlog",
    dueDate: "11 Feb",
    description: "Quickly resolve slow API response times & Database queries.",
    assignee: "Noel",
    repository: "ui-auth"
  },
  {
    id: "onboarding-project-srs-3",
    title: "Onboarding Project SRS",
    status: "To-do",
    priority: "Important",
    dueDate: "14 Mar",
    description: "Use diagramming and annotation tools to create the SRS for the project.",
    assignee: "Noel",
    repository: "erp"
  },
  {
    id: "critical-bug-fix-4",
    title: "Critical Bug Fix",
    status: "To-do",
    priority: "Urgent",
    dueDate: "23 Sep",
    description: "Issues that affect core functionality (e.g., payment module or login failures).",
    assignee: "Noel",
    repository: "test"
  },
  {
    id: "feature-enhancement-5",
    title: "Feature Enhancement",
    status: "To-do",
    priority: "Important",
    dueDate: "19 Aug",
    description: "Quickly resolve slow API response times & Database queries (feature improvements).",
    assignee: "Noel",
    repository: "test"
  },
  {
    id: "site-map-website-6",
    title: "Site Map Website",
    status: "In Progress",
    priority: "Backlog",
    dueDate: "10 Mar",
    description: "Use AI to generate sitemap for the website.",
    assignee: "Noel",
    repository: "ui-auth"
  },
  {
    id: "ui-ux-improvements-7",
    title: "UI/UX Improvements",
    status: "In Progress",
    priority: "Urgent",
    dueDate: "17 Jan",
    description: "Improve auth by adding multi-factor authentication.",
    assignee: "Noel",
    repository: "finance"
  },
  {
    id: "api-integration-8",
    title: "API Integration",
    status: "Done",
    priority: "Important",
    dueDate: "14 Mar",
    description: "Integrate payment gateway scheduled for the next release cycle.",
    assignee: "Noel",
    repository: "bems-ui"
  },
  {
    id: "refactor-codebase-9",
    title: "Refactor the existing codebase",
    status: "Done",
    priority: "Urgent",
    dueDate: "20 April",
    description: "Ensure that the code adheres to the latest coding standards and best practices.",
    assignee: "Noel",
    repository: "bems-ui"
  },
  {
    id: "conduct-code-review-10",
    title: "Conduct code review for the team",
    status: "Done",
    priority: "Urgent",
    dueDate: "23 Sep",
    description: "Review the code changes made by the team members to ensure quality and consistency.",
    assignee: "Noel",
    repository: "test"
  }
];

// Filter tasks by status
const todoTasks = computed(() => tasks.filter(task => task.status === "To-do"));
const inProgressTasks = computed(() => tasks.filter(task => task.status === "In Progress"));
const doneTasks = computed(() => tasks.filter(task => task.status === "Done"));
</script>

<template>
  <div class="grid grid-rows-[auto_1fr]  w-full gap-4  p-4 overflow-hidden h-full">
    <TasksHeader />
    <div class="grid w-full h-full gap-2 overflow-hidden grid-cols-3">
      <TaskColumn title="To-do" :tasks="todoTasks" :task-count="todoTasks.length" />
      <TaskColumn title="In Progress" :tasks="inProgressTasks" :task-count="inProgressTasks.length" />
      <TaskColumn title="Done" :tasks="doneTasks" :task-count="doneTasks.length" />
    </div>
  </div>
</template>

<style scoped></style>