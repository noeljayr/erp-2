import { defineStore } from "pinia";

type Request = {
  amount: number;
  currency: string;
  purpose: string;
  description: string | null;
  approver_id: string;
  required_on: string | null;
};

export const useViewRequestFormData = defineStore("view-request", {
  state: (): Request => ({
    amount: 0.0,
    currency: "MWK",
    purpose: "",
    description: "",
    approver_id: "",
    required_on: "",
  }),
  actions: {
    setAmount(amount: number) {
      this.amount = amount;
    },
    setCurrency(currency: string) {
      this.currency = currency;
    },
    setPurpose(purpose: string) {
      this.purpose = purpose;
    },
    setDescription(description: string | null) {
      this.description = description;
    },
    setApprover(id: string) {
      this.approver_id = id;
    },
    setRequiredOn(date: string | null) {
      this.required_on = date;
    },
    validateFormData(): boolean {
      return (
        this.amount > 0 &&
        this.currency.trim() !== "" &&
        this.purpose.trim() !== "" &&
        this.approver_id.trim() !== ""
      );
    },
  },
});
