<script setup lang="ts">
import IconCheck from '~/components/svg/IconCheck.vue';
import { AnimatePresence, motion } from 'motion-v';
import { useTaskFormData } from '#imports';
import IconUserCircle from '~/components/svg/IconUserCircle.vue';
import type { UserTypes } from '~/types/userTypes';
import { BASE_URL } from '~/constants/base-url';

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useTaskFormData();
const assignee = ref<UserTypes | null>(null);

function setAssignee(p: UserTypes) {
  assignee.value = p;
  formData.setAssignee(p.user_id);
}

const token = useAuthStore();

const { data: assignees, status } = useFetch(`${BASE_URL}/users`, {
  lazy: true,
  server: false,
  headers: {
    authorization: `Bearer ${token.token}`,
  },
  transform: (assignee: UserTypes[]) => {
    return assignee.map((assignee) => ({
      user_id: assignee.user_id,
      first_name: assignee.first_name,
      last_name: assignee.last_name,
      email: assignee.email,
      role: assignee.role,
      phone: assignee.phone,
      github_username: assignee.github_username
    }));
  },
});

watch(
  [() => formData.assignee, assignees],
  ([newApproverId, partnersList]) => {
    if (newApproverId && partnersList) {
      const foundApprover = partnersList.find(
        (p) => p.user_id === newApproverId
      );
      assignee.value = foundApprover || null;
    } else {
      assignee.value = null;
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

      {{ assignee ? assignee.first_name : 'Assignee' }}
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
          >Assign task to a member</span
        >
        <template
          v-if="status === 'success' && assignees"
          v-for="a in assignees"
        >
          <span
            @click="
              () => {
                setAssignee(a);
                setShow(false);
              }
            "
            v-if="a.user_id !== token.user_id"
            class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
          >
            <span class="opacity-75 font-medium">
              {{ a.first_name }} {{ a.last_name }}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                v-if="assignee?.user_id === a.user_id"
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
