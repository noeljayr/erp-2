import { defineStore } from 'pinia';

type Request = {
  title: string;
  lead: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
};

export const useProjectFormData = defineStore('new-project', {
  state: (): Request => ({
    title: '',
    lead: '',
    description: '',
    startDate: null,
    endDate: null
  }),
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    setLead(lead: string) {
      this.lead = lead;
    },
    setDescription(description: string | null) {
      this.description = description;
    },
    setStartDate(date: string | null) {
      this.startDate = date;
    },
    setEndDate(date: string | null) {
      this.endDate = date;
    },
    validateFormData(): boolean {
      return (
        this.title.trim() !== '' &&
        this.lead.trim() !== ''
      );
    },
  },
});
