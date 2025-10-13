import { TOKEN_NAME } from "~/constants/token-name";

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Initialize the store on client-side
  authStore.initialize();

  // Watch for token changes and persist to localStorage
  watch(
    () => authStore.token,
    (newToken) => {
      if (newToken) {
        localStorage.setItem("auth-token", newToken);
      } else {
        localStorage.removeItem("auth-token");
      }
    },
    { immediate: true }
  );

  // Restore token from localStorage on page refresh
  const savedToken = localStorage.getItem("auth-token");
  if (savedToken && !authStore.token) {
    // Set the cookie and refresh the store
    const tokenCookie = useCookie(TOKEN_NAME);
    tokenCookie.value = savedToken;
    authStore.refresh();
  }
});
