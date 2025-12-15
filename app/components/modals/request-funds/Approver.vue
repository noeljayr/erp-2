<script setup lang="ts">
import IconCheck from "~/components/svg/IconCheck.vue";
import { AnimatePresence, motion } from "motion-v";
import { useRequestFormData } from "#imports";
import IconUserCircle from "~/components/svg/IconUserCircle.vue";
import type { UserTypes } from "~/types/userTypes";
import { BASE_URL } from "~/constants/base-url";
import { useAuthStore } from "#imports";
import IconChevronDown from "~/components/svg/IconChevronDown.vue";

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));

const formData = useRequestFormData();
const approver = ref<UserTypes | null>(null);

function setParner(p: UserTypes) {
  approver.value = p;
  formData.setApprover(p.user_id);
}

const token = useAuthStore();

const { data: partners, status } = useFetch(`${BASE_URL}/users?role=Partner`, {
  lazy: true,
  server: false,
  headers: {
    authorization: `Bearer ${token.token}`,
  },
  transform: (approver: UserTypes[]) => {
    return approver.map((approver) => ({
      user_id: approver.user_id,
      first_name: approver.first_name,
      last_name: approver.last_name,
      email: approver.email,
      role: approver.role,
      phone: approver.phone,
    }));
  },
});
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p2 font-medium p-1.5 pr-2.5 flex space-x-1 items-center rounded-[0.4rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconUserCircle class="h-4 w-4 mr-1" />
      {{ approver ? approver.first_name : "Approver" }}
      <IconChevronDown class="h-3.5 w-3.5 ml-1" />
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
          >Who to approve the request</span
        >
        <template v-if="status === 'success' && partners" v-for="p in partners">
          <span
            @click="
              () => {
                setParner(p);
                setShow(false);
              }
            "
            v-if="p.user_id !== token.user_id"
            class="option w-[95%] relative rounded-[0.35rem] mx-auto space-x-2 font-p2 px-2 py-[0.35rem] cursor-pointer bg-white hover:brightness-90"
          >
            <span class="opacity-75 font-medium">
              {{ p.first_name }} {{ p.last_name }}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                v-if="approver?.user_id === p.user_id"
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
