import { BASE_URL } from '~/constants/base-url';
import { TOKEN_NAME } from '~/constants/token-name';
import { useRouter } from '#app';

type LoginParams = {
  email: string;
  password: string;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setSuccess: (success: boolean) => void;
  setResponseMessage: (message: string) => void;
  e: Event;
};

export const login = async ({
  email,
  password,
  setLoading,
  setError,
  setSuccess,
  setResponseMessage,
  e,
}: LoginParams) => {
  e.preventDefault();

  setLoading(true);
  setError(false);
  setSuccess(false);

  const authStore = useAuthStore();

  try {
    const response = await fetch(`${BASE_URL}/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setSuccess(true);
      setResponseMessage(data.message);

      // Set the token in cookie using Nuxt's useCookie
      const tokenCookie = useCookie(TOKEN_NAME, {
        default: () => '',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      tokenCookie.value = data.token;

      // Refresh the auth store to update authentication state
      authStore.refresh();

      // Wait for the next tick to ensure reactivity has updated
      await nextTick();

      // Get redirect path before the delay
      const route = useRoute();
      const redirectPath = route.query.redirect as string;

      // Small delay to show success message briefly, then redirect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const targetPath =
            redirectPath && redirectPath !== '/auth/login/'
              ? decodeURIComponent(redirectPath)
              : '/';
          window.location.href = targetPath;
        }
      }, 1500);
    } else {
      setResponseMessage(data.message);
      setError(true);
    }
  } catch (err) {
    setError(true);
    setResponseMessage('Something went wrong.');
  } finally {
    setLoading(false);
  }
};

type ResetParams = {
  email: string;
  new_password: string;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setSuccess: (success: boolean) => void;
  setResponseMessage: (message: string) => void;
  e: Event;
};

export const resetPassword = async ({
  email,
  new_password,
  setLoading,
  setError,
  setSuccess,
  setResponseMessage,
  e,
}: ResetParams) => {
  e.preventDefault();

  setLoading(true);
  setError(false);
  setSuccess(false);

  try {
    const response = await fetch(`${BASE_URL}/users/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        new_password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setSuccess(true);
      setResponseMessage(data.message);

      const route = useRoute();
      const redirectPath = route.query.redirect as string;

      // Small delay to show success message briefly, then redirect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const targetPath =
            redirectPath && redirectPath !== '/auth/login/'
              ? decodeURIComponent(redirectPath)
              : '/';
          window.location.href = targetPath;
        }
      }, 1500);
    } else {
      setResponseMessage(data.message);
      setError(true);
    }
  } catch (err) {
    setError(true);
    setResponseMessage('Something went wrong.');
  } finally {
    setLoading(false);
  }
};

export const logout = async () => {
  const authStore = useAuthStore();
  authStore.logout();
  const router = useRouter();
  await router.push('/auth/login/');
};
