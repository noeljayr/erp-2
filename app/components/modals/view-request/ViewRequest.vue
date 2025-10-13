<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v';
import { motionTransition, closeModal } from '#imports';
import IconWalletOpen from '~/components/svg/IconWalletOpen.vue';
import IconChevronRght from '~/components/svg/IconChevronRght.vue';
import IconX from '~/components/svg/IconX.vue';
import Amount from './Amount.vue';
import Description from './Description.vue';
import Currency from './Currency.vue';
import Purpose from './Purpose.vue';
import Approver from './Approver.vue';
import DateRequired from './DateRequired.vue';
import { useViewRequestFormData } from '#imports';
import { updateRequest, updateStatus } from '~/api-calls/requests';
import { BASE_URL } from '~/constants/base-url';
import type { RequestTypes } from '~/types/requestTypes';

const token = useAuthStore();

const { isOpen: open } = useUrlModal('view-request');
const formData = useViewRequestFormData();

const loading = ref(false);
const setLoading = (val: boolean) => {
  loading.value = val;
};
const error = ref(false);
const setError = (val: boolean) => {
  error.value = val;
};
const success = ref(false);
const setSuccess = (val: boolean) => {
  success.value = val;
};

const submit = (e: Event) => {
  e.preventDefault();
  updateRequest({
    setLoading,
    setError,
    setSuccess,
    setStatusMessage: () => {},
  });
};

const selectedRequestId = ref<string>('');

// Function to get requestId from URL parameters
const getRequestIdFromUrl = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('requestId') || '';
  }
  return '';
};

// Watch for URL changes to get the requestId
const updateRequestId = () => {
  const id = getRequestIdFromUrl();
  if (id !== selectedRequestId.value) {
    selectedRequestId.value = id;
  }
};

// Initial setup and URL watching
onMounted(() => {
  updateRequestId();

  // Listen for URL changes
  window.addEventListener('popstate', updateRequestId);

  // Listen for programmatic URL changes
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    updateRequestId();
  };
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', updateRequestId);
  }
});

const requestData = ref<RequestTypes | null>(null);
const status = ref('idle');
const isLoading = ref(false);

// Function to populate form data from fetched request
const populateFormData = (data: RequestTypes) => {
  formData.setAmount(parseFloat(data.amount));
  formData.setCurrency(data.currency);
  formData.setPurpose(data.purpose);
  formData.setDescription(data.description);
  formData.setApprover(data.approver_id);
  formData.setRequiredOn(data.required_on);
};

// Function to clear form data
const clearFormData = () => {
  formData.setAmount(0);
  formData.setCurrency('MWK');
  formData.setPurpose('');
  formData.setDescription('');
  formData.setApprover('');
  formData.setRequiredOn('');
};

// Single consolidated watcher for selectedRequestId changes
watch(
  selectedRequestId,
  async (newId) => {
    // Clear form data immediately when ID changes
    clearFormData();
    requestData.value = null;

    if (!newId) return;

    try {
      isLoading.value = true;
      status.value = 'pending';

      const response = await $fetch<RequestTypes>(
        `${BASE_URL}/requests/${newId}/`,
        {
          headers: {
            authorization: `Bearer ${token.token}`,
          },
        }
      );

      requestData.value = response;
      status.value = 'success';

      // Populate form data immediately after successful fetch
      await nextTick();
      populateFormData(response);
    } catch (error) {
      console.error('Error fetching request data:', error);
      status.value = 'error';
      requestData.value = null;
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

// Watch for modal close and clear form data
watch(open, (isOpen) => {
  if (!isOpen) {
    clearFormData();
    selectedRequestId.value = '';
    requestData.value = null;
  }
});
</script>
<template v-if="selectedRequestId.length > 0 && requestData">
  <AnimatePresence mode="popLayout">
    <div
      v-if="open"
      @click="
        () => {
          closeModal('view-request');
          closeModal('requestId');
        }
      "
      class="absolute z-20 left-0 top-0 w-screen h-screen bg-black opacity-30"
    ></div>

    <motion.form
      @submit="submit"
      :initial="{ opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionTransition({ duration: 0.25 })"
      v-if="open"
      class="fixed z-30 self-center h-[23.25rem] grid grid-rows-[auto_1fr_auto] justify-self-center border border-[#D2D2D2] w-[40%] max-[1440px]:w-[55%] top-[1rem] rounded-[0.5rem] bg-white"
    >
      <div class="flex w-full items-center px-4 pt-2 pb-2 border-b">
        <div class="flex items-center space-x-2">
          <IconWalletOpen class="h-4 w-4 opacity-75" />
          <IconChevronRght class="h-4 w-4 opacity-50" />
          <span
            v-if="token.user_id !== requestData?.requested_by.user_id"
            class="font-medium"
          >
            {{
              requestData
                ? requestData.requested_by.first_name +
                  ' ' +
                  requestData.requested_by.last_name +
                  ' initiated the request ' +
                  formatDate(requestData?.initiated_on)
                : ''
            }}
          </span>

          <span v-else class="font-medium">
            You initiated the request
            {{ formatDate(requestData?.initiated_on) }}
          </span>

          <span
            v-if="requestData"
            :class="`font-p3 font-medium text-sm px-2 rounded-[0.35rem] ${requestData.status.toLowerCase()}`"
          >
            {{ requestData.status }}
          </span>
        </div>

        <span
          @click="
            () => {
              closeModal('view-request');
              closeModal('requestId');
            }
          "
          style="transition: var(--transition)"
          class="bg-white h-[1.75rem] w-[1.75rem] rounded-[0.35rem] cursor-pointer hover:brightness-90 flex items-center justify-center ml-auto"
        >
          <IconX strokeWidth="2" class="h-4 w-4" />
        </span>
      </div>

      <template v-if="requestData">
        <div class="p-4 grid grid-rows-[auto_1fr]">
          <Amount
            :userId="requestData.requested_by.user_id || ''"
            :status="requestData?.status"
          />
          <Description
            :userId="requestData.requested_by.user_id || ''"
            :status="requestData?.status"
          />
        </div>

        <div class="flex w-full items-center px-4 pt-2 pb-2 border-t">
          <div class="flex items-center space-x-2">
            <Currency
              :userId="requestData.requested_by.user_id || ''"
              :status="requestData?.status"
            />

            <Purpose
              :userId="requestData.requested_by.user_id || ''"
              :status="requestData?.status"
            />

            <Approver
              :userId="requestData.requested_by.user_id || ''"
              :status="requestData?.status"
            />

            <DateRequired
              :userId="requestData.requested_by.user_id || ''"
              :status="requestData?.status"
            />
          </div>

          <button
            v-if="
              token.user_id === requestData.requested_by.user_id &&
              requestData.status.toLowerCase() == 'pending'
            "
            :disabled="!formData.validateFormData()"
            :class="`cta ml-auto disabled:cursor-not-allowed ${
              loading ? 'opacity-50 pointer-events-none' : ''
            }`"
          >
            Save changes
          </button>

          <div
            v-if="
              token.role === 'Partner' &&
              requestData.status.toLowerCase() == 'pending' &&
              token.user_id == requestData.approver_id
            "
            class="flex items-center gap-2 ml-auto"
          >
            <button
              type="button"
              @click="
                updateStatus({
                  id: requestData.id,
                  status: 'Rejected',
                  setLoading,
                  setError,
                  setSuccess,
                  setStatusMessage: () => {},
                })
              "
              style="
                background-color: #ec1414;
                color: white;
                border: 1px solid #cc0707;
              "
              :disabled="!requestData"
              :class="`cta ml-auto disabled:cursor-not-allowed ${
                loading ? 'opacity-50 pointer-events-none' : ''
              }`"
            >
              Reject
            </button>

            <button
              @click="
                updateStatus({
                  id: requestData.id,
                  status: 'Approved',
                  setLoading,
                  setError,
                  setSuccess,
                  setStatusMessage: () => {},
                })
              "
              style="
                background-color: #02b34c;
                color: white;
                border: 1px solid #029740;
              "
              type="button"
              :disabled="!requestData"
              :class="`cta ml-auto disabled:cursor-not-allowed ${
                loading ? 'opacity-50 pointer-events-none' : ''
              }`"
            >
              Approve
            </button>
          </div>
        </div>
      </template>
    </motion.form>
  </AnimatePresence>
</template>

<style scoped>
.pending {
  color: #fcc11e;
  background-color: rgba(252, 193, 30, 0.1);
  border: 1px solid rgba(252, 193, 30, 0.25);
}

.approved {
  color: #018f3c;
  background-color: rgba(2, 179, 76, 0.1);
  border: 1px solid rgba(2, 179, 76, 0.25);
}

.rejected {
  color: #bd0505;
  background-color: rgba(236, 20, 20, 0.1);
  border: 1px solid rgba(236, 20, 20, 0.25);
}
</style>
