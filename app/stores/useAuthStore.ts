import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_NAME } from '~/constants/token-name';
import type { UserTypes } from '~/types/userTypes';

interface AuthState extends UserTypes {
  token: string;
}

const getEmptyState = (): AuthState => ({
  token: '',
  user_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
});

export const useAuthStore = defineStore('auth', () => {
  // State - use reactive instead of ref for toRefs to work properly
  const state = reactive<AuthState>(getEmptyState());

  // Getters
  const isAuthenticated = computed(() => !!state.token);
  const fullName = computed(() =>
    `${state.first_name} ${state.last_name}`.trim()
  );

  // Helper function to get cookie value (works on both server and client)
  const getTokenFromCookie = (): string => {
    const tokenCookie = useCookie(TOKEN_NAME);
    return tokenCookie.value?.toString() ?? '';
  };

  // Actions
  const refresh = () => {
    const cookieToken = getTokenFromCookie();

    if (!cookieToken) {
      // No cookie → clear all fields
      Object.assign(state, getEmptyState());
      return;
    }

    try {
      const decoded = jwtDecode<UserTypes>(cookieToken);
      Object.assign(state, {
        token: cookieToken,
        ...decoded,
      });
    } catch {
      // Invalid JWT → clear all fields
      Object.assign(state, getEmptyState());
    }
  };

  const logout = () => {
    // 1) Remove the cookie
    const tokenCookie = useCookie(TOKEN_NAME);
    tokenCookie.value = null;

    // 2) Reset state to initial empty values
    Object.assign(state, getEmptyState());

    // 3) Clear localStorage manually (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
  };

  // Initialize store - now works on both server and client
  const initialize = () => {
    refresh();
  };

  // Handle post-login redirection
  const handlePostLoginRedirect = async () => {
    const route = useRoute();
    const redirectPath = route.query.redirect as string;

    try {
      if (redirectPath && redirectPath !== '/auth/login') {
        await navigateTo(decodeURIComponent(redirectPath), { replace: true });
      } else {
        await navigateTo('/', { replace: true });
      }
    } catch (error) {
      // Fallback: force a page reload to ensure proper navigation
      console.log('Navigation failed, reloading page');
      if (typeof window !== 'undefined') {
        window.location.href =
          redirectPath && redirectPath !== '/auth/login'
            ? decodeURIComponent(redirectPath)
            : '/';
      }
    }
  };

  return {
    // State - now toRefs works properly with reactive object
    ...toRefs(state),

    // Getters
    isAuthenticated,
    fullName,

    // Actions
    refresh,
    logout,
    initialize,
    handlePostLoginRedirect,
  };
});
