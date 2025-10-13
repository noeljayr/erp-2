<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Protected Test Page</h1>
    <p>If you can see this page, you are authenticated!</p>
    <p>
      This page should redirect to login if you're not authenticated, and
      preserve this route for after login.
    </p>

    <button
      @click="logout"
      class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
  await navigateTo("/auth/login");
};
</script>
