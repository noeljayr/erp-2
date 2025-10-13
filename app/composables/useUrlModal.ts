import { ref, onMounted, onUnmounted } from "vue";

export const useUrlModal = (paramName: string) => {
  const isOpen = ref(false);

  // Function to check URL parameters and update modal state
  const updateModalState = () => {
    const params = new URLSearchParams(window.location.search);
    isOpen.value = params.has(paramName);
  };

  // Listen for popstate events (browser back/forward)
  const handlePopState = () => {
    updateModalState();
  };

  onMounted(() => {
    // Check initial URL state
    updateModalState();

    // Listen for browser navigation events
    window.addEventListener("popstate", handlePopState);

    // Listen for pushstate/replacestate events (for programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      updateModalState();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      updateModalState();
    };
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", handlePopState);
  });

  return {
    isOpen,
    updateModalState,
  };
};
