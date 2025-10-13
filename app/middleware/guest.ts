export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // If user is already authenticated, redirect to home or intended page
  if (authStore.isAuthenticated) {
    // Check if there's a redirect parameter
    const redirectPath = to.query.redirect as string;

    if (redirectPath && redirectPath !== "/auth/login") {
      // Redirect to the originally intended page
      return navigateTo(decodeURIComponent(redirectPath));
    } else {
      // Default redirect to home page
      return navigateTo("/");
    }
  }
});
