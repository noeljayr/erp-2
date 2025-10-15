import { defineStore } from 'pinia';

type Request = {
  title: string;
  priority: string;
  assignee: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  repo: string | null;
};

export const useTaskFormData = defineStore('task', {
  state: (): Request => ({
    title: '',
    priority: '',
    assignee: '',
    description: '',
    status: 'To-do',
    dueDate: '',
    repo: '',
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    setPriority(priority: string) {
      this.priority = priority;
    },
    setAssignee(assignee: string) {
      this.assignee = assignee;
    },
    setDescription(description: string | null) {
      this.description = description;
    },
    setStatus(status: string) {
      this.status = status;
    },
    setDueDate(date: string | null) {
      this.dueDate = date;
    },
    setRepo(repo: string | null) {
      this.repo = repo;
    },
    validateFormData(): boolean {
      return (
        this.title.trim() !== '' &&
        this.priority.trim() !== '' &&
        this.status.trim() !== ''
      );
    },
  },
});
