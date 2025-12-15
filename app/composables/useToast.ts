interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export const useToast = () => {
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
    duration = 3000
  ) => {
    const id = toastId++;
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
  };
};
