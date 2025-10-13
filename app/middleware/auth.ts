export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // If user is not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    // Store the intended route as a query parameter
    const redirectPath = to.fullPath;
    return navigateTo(
      `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
    );
  }
});
