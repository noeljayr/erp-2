<script setup lang="ts">
import { definePageMeta } from '#imports';
import { motion, AnimatePresence } from 'motion-v';
import { login } from '~/api-calls/auth';
import IconEye from '~/components/svg/IconEye.vue';
import IconEyeSlash from '~/components/svg/IconEyeSlash.vue';
import Loader from '~/components/ux/Loader.vue';

const passwordInput = ref(true);
const submitButton = ref<HTMLButtonElement | null>(null);

definePageMeta({
  layout: 'auth',
  title: 'Bintel - Login',
  middleware: 'guest',
});

function changeInputType() {
  passwordInput.value = !passwordInput.value;
}

const submit = () => {
  submitButton.value?.click();
};

const email = ref('');
const password = ref('');
const responseMessage = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const setLoading = (state: boolean) => {
  loading.value = state;
};

const setSuccess = (state: boolean) => {
  success.value = state;
};

const setError = (state: boolean) => {
  error.value = state;
};

const setResponseMessage = (message: string) => {
  if (message && message.length > 2) {
    responseMessage.value = message;
  } else {
    responseMessage.value = 'Try again in a moment.';
  }
};
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center flex-col">
    <AnimatePresence mode="popLayout">
      <motion.form
        layout="position"
        :transition="motionTransition()"
        key="form"
        @submit="
          (e) => {
            login({
              email,
              password,
              setLoading,
              setSuccess,
              setError,
              setResponseMessage,
              e: e,
            });
          }
        "
        action=""
        class="flex flex-col space-y-4 w-[17rem] items-center"
      >
        <NuxtImg src="/bintel.png" class="w-10 h-auto" />

        <div class="flex flex-col space-y-2 w-full">
          <input
            required
            v-model="email"
            type="text"
            class="font-medium h-9 border rounded-[0.35rem] w-full px-3 outline-none"
            placeholder="Email"
          />

          <div class="flex relative items-center">
            <input
              required
              v-model="password"
              :type="passwordInput ? 'password' : 'text'"
              class="font-medium h-9 border rounded-[0.35rem] w-full px-3 outline-none"
              placeholder="Password"
            />

            <span
              class="cursor-pointer absolute right-2"
              @click="changeInputType"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  :transition="motionTransition()"
                  v-if="passwordInput"
                >
                  <IconEye class="h-4 w-3" />
                </motion.span>
                <motion.span
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  :transition="motionTransition()"
                  v-if="!passwordInput"
                >
                  <IconEyeSlash class="h-4 w-3" />
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <button ref="submitButton" style="width: 100%" class="cta">
            <Loader v-if="loading" />
            <template v-else>Login</template>
          </button>
        </div>
      </motion.form>

      <motion.span
        key="error"
        :initial="{ opacity: 0, y: 60 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 60 }"
        :transition="motionTransition()"
        v-if="error"
        layout="position"
        class="error bg-red-100 font-semibold px-8 py-1 mt-4 rounded-3xl font-p3 text-red-600 border border-red-200"
        >{{ responseMessage }}.
        <span
          @click="submit"
          class="font-bold underline text-red-600 cursor-pointer"
          >Try again</span
        ></motion.span
      >

      <motion.span
        key="success"
        :transition="motionTransition()"
        :initial="{ opacity: 0, y: 60 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 60 }"
        layout="position"
        class="bg-green-200 font-semibold px-8 py-1 mt-4 rounded-3xl font-p3 text-green-600 border border-green-300"
        v-if="success"
        >You're logged in and ready to go...
      </motion.span>
    </AnimatePresence>
  </div>
</template>

<style scoped></style>
