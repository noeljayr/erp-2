export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth'];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => to.path === route || to.path.startsWith(route + '/')
  );

  // Skip middleware if we're on a public route
  if (isPublicRoute) {
    return;
  }

  // If it's a protected route and user is not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    // Store the intended route as a query parameter
    const redirectPath = to.fullPath;
    return navigateTo(
      `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
    );
  }
});
