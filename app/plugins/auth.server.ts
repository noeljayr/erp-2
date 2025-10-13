export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Initialize the store on server-side to check authentication status
  authStore.initialize();
});
