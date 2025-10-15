<script setup lang="ts">
import IconCheck from '~/components/svg/IconCheck.vue';
import { AnimatePresence, motion } from 'motion-v';
import { useProjectFormData } from '#imports';
import IconUserCircle from '~/components/svg/IconUserCircle.vue';
import type { UserTypes } from '~/types/userTypes';
import { BASE_URL } from '~/constants/base-url';

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useProjectFormData();
const lead = ref<UserTypes | null>(null);

function setLead(p: UserTypes) {
  lead.value = p;
  formData.setLead(p.user_id);
}

const token = useAuthStore();

const { data: users, status } = useFetch(`${BASE_URL}/users`, {
  lazy: true,
  server: false,
  headers: {
    authorization: `Bearer ${token.token}`,
  },
  transform: (users: UserTypes[]) => {
    return users.map((user) => ({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      github_username: user.github_username,
    }));
  },
});

watch(
  [() => formData.lead, users],
  ([newApproverId, partnersList]) => {
    if (newApproverId && partnersList) {
      const foundApprover = partnersList.find(
        (u) => u.user_id === newApproverId
      );
      lead.value = foundApprover || null;
    } else {
      lead.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p3 font-medium p-1 pr-2 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconUserCircle class="h-4 w-4 mr-1" />

      {{ lead ? lead.first_name : 'Lead' }}
    </button>

    <AnimatePresence>
      <motion.div
        v-if="show"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="motionTransition({ duration: 0.25 })"
        class="popup"
      >
        <span
          class="w-full font-medium opacity-50 border-b py-2 px-4 font-p2 mb-1"
          >Project lead</span
        >
        <template v-if="status === 'success' && users" v-for="a in users">
          <span
            @click="
              () => {
                setLead(a);
                setShow(false);
              }
            "
            class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
          >
            <span class="opacity-75 font-medium">
              {{ a.first_name }} {{ a.last_name }}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                v-if="lead?.user_id === a.user_id"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                :transition="motionTransition({ duration: 0.15 })"
                class="absolute right-0"
              >
                <IconCheck stroke="2" class="h-4 w-4" />
              </motion.span>
            </AnimatePresence>
          </span>
        </template>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped></style>
