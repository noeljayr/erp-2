<script setup lang="ts">
import IconChevronDown from '../svg/IconChevronDown.vue';
import { logout } from '~/api-calls/auth';

defineProps({
  invert: {
    type: Boolean,
    required: false,
  },
});

const token = useAuthStore();

const showMenu = ref(false);
const profileRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const setShowMenu = (state: boolean) => {
  showMenu.value = state;
};

useClickOutside(profileRef, () => setShowMenu(false));
</script>

<template>
  <div
    ref="profileRef"
    class="profile relative px-[0.35rem] w-full cursor-pointer flex items-center"
  >
    <span
      @click="setShowMenu(!showMenu)"
      class="flex w-full items-center gap-2"
    >
      <span
        class="h-[1.35rem] w-[1.35rem] bg-[var(--primary)] rounded-[var(--radius-s)] flex items-center justify-center font-extrabold text-white font-p4"
      >
        {{ token.first_name.charAt(0).toUpperCase() }}
      </span>

      <span class="mr-auto">{{ token.first_name }}</span>

      <IconChevronDown
        :class="`h-3 w-3 opacity-50 ${invert ? 'rotate-180' : ''}`"
      />
    </span>

    <div
      v-if="showMenu"
      :class="`absolute profile-menu p-1 space-y-1 bg-white z-10 left-1 ${
        invert ? 'bottom-[110%]' : 'top-[110%]'
      } w-[calc(100%_-_0.25rem)] flex flex-col rounded-[var(--radius-s)] border`"
    >
      <NuxtLink
        @click="setShowMenu(false)"
        class="h-[1.5rem] bg-white px-2 hover:brightness-90 rounded-[0.35rem] flex items-center"
        href="#"
        >Profile</NuxtLink
      >
      <NuxtLink
        @click="setShowMenu(false)"
        class="h-[1.5rem] bg-white px-2 hover:brightness-90 rounded-[0.35rem] flex items-center"
        href="#"
        >Settings</NuxtLink
      >
      <hr class="outline-[var(--border)]" />
      <button
        @click="
          () => {
            setShowMenu(false);
            logout();
          }
        "
        class="w-full h-[1.5rem] bg-white px-2 hover:brightness-90 rounded-[0.35rem] flex items-center text-start"
        type="button"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-menu {
  box-shadow: lch(0 0 0 / 0.022) 0px 6px 18px, lch(0 0 0 / 0.044) 0px 3px 9px,
    lch(0 0 0 / 0.044) 0px 1px 1px;
}

.profile-menu * {
  transition: var(--transition);
}
</style>
