<script setup lang="ts">
import { formatNumber } from '#imports';
import type { RequestTypes } from '~/types/requestTypes';
import { useRefreshStore } from '#imports';
import { getRequests } from '~/api-calls/requests';
import IconChevronLeft from './svg/IconChevronLeft.vue';
import IconChevronRght from './svg/IconChevronRght.vue';

const refreshStore = useRefreshStore();

const loading = ref(false);
const setLoading = (val: boolean) => {
  loading.value = val;
};
const error = ref(false);
const setError = (val: boolean) => {
  error.value = val;
};

function separateNumber(num: string) {
  const numValue = parseFloat(num);
  const fixed = numValue.toFixed(2);

  const [whole, decimal] = fixed.split('.');

  return {
    whole: whole,
    decimal: '.' + decimal,
  };
}

type Response = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: RequestTypes[];
};

const requestsData = ref<Response>();
const setData = (data: Response) => {
  requestsData.value = data;
};

// Get URL parameters
const getURLParams = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || undefined,
    status: params.get('status') || undefined,
    page: params.get('page') ? parseInt(params.get('page')!) : 1,
  };
};

// Fetch requests data
const fetchRequests = async () => {
  const params = getURLParams();

  await getRequests({
    setLoading,
    setError,
    setData,
    search: params.search,
    status: params.status,
    page: params.page,
    limit: 20,
  });
};

// Watch for URL changes (when filters change in header)
const urlParams = ref(getURLParams());
watch(
  () => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return '';
  },
  () => {
    const newParams = getURLParams();
    if (JSON.stringify(newParams) !== JSON.stringify(urlParams.value)) {
      urlParams.value = newParams;
      fetchRequests();
    }
  },
  { immediate: false }
);

// Watch for refresh store changes
watch(
  () => refreshStore.refresh,
  () => {
    fetchRequests();
  }
);

// Initial data fetch
onMounted(() => {
  fetchRequests();

  // Listen for popstate events (back/forward navigation) and custom URL change events
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', fetchRequests);
    window.addEventListener('urlParamsChanged', fetchRequests);

    onBeforeUnmount(() => {
      window.removeEventListener('popstate', fetchRequests);
      window.removeEventListener('urlParamsChanged', fetchRequests);
    });
  }
});

// Pagination functions
const goToPage = (page: number) => {
  if (
    page < 1 ||
    (requestsData.value && page > requestsData.value.totalPages)
  ) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  params.set('page', page.toString());

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newUrl);

  // Trigger a custom event to notify that URL params changed
  window.dispatchEvent(new CustomEvent('urlParamsChanged'));
};

const getVisiblePages = (): (number | string)[] => {
  if (!requestsData.value) return [];

  const current = requestsData.value.page;
  const total = requestsData.value.totalPages;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current <= 4) {
      // Near the beginning
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      // Near the end
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
};

const viewRequest = (id: string) => {
  openModal('view-request', 'true');
  openModal('requestId', id);
};
</script>

<template>
  <div class="h-full grid grid-rows-[auto_1fr_auto] w-full">
    <div
      class="t-header w-full grid grid-cols-[12%_13%_13%_1fr_13%_10%_5rem] border-b border-b-[var(--border)] pb-2 items-center opacity-50"
    >
      <span class="font-medium px-2">Amount</span>
      <span class="font-medium px-2">By</span>
      <span class="font-medium px-2">Approver</span>
      <span class="font-medium px-2">Purpose</span>
      <span class="font-medium px-2">Initiated on</span>
      <span class="font-medium px-2">Required on</span>
      <span class="font-medium px-2">Status</span>
    </div>

    <div class="h-full w-full grid auto-rows-min overflow-y-auto">
      <template v-if="requestsData?.data && requestsData.data.length > 0">
        <div
          @click="viewRequest(request.id)"
          v-for="request in requestsData.data"
          :key="request.request_id"
          class="t-row h-[2.8rem] border-b border-b-[var(--border)] cursor-pointer bg-white w-full grid grid-cols-[12%_13%_13%_1fr_13%_10%_5rem] items-center"
        >
          <span
            class="flex h-full items-center border-r border-r-[var(--border)] px-2"
          >
            <span class="">{{ request.currency == 'MWK' ? 'K ' : '$ ' }}</span>
            <span v-if="separateNumber(request.amount).whole">{{
              formatNumber(
                (separateNumber(request.amount).whole ?? '').toString()
              )
            }}</span>
            <span class="opacity-50">
              {{ separateNumber(request.amount).decimal }}
            </span>
          </span>

          <span
            class="truncate w-full h-full items-center flex border-r border-r-[var(--border)] px-2"
            >{{ request.requested_by.first_name }}</span
          >

          <span
            class="truncate w-full h-full items-center flex border-r border-r-[var(--border)] px-2"
            >{{ request.approver?.first_name }}</span
          >
          <span
            class="truncate w-full h-full items-center flex border-r border-r-[var(--border)] px-2"
          >
            <span class="truncate">
              {{ request.purpose }}
            </span>
          </span>
          <span
            class="truncate w-full h-full items-center flex border-r border-r-[var(--border)] px-2"
          >
            <span class="truncate">
              {{ formatDate4(request.initiated_on) }}
            </span>
          </span>
          <span
            class="truncate w-full h-full items-center flex border-r border-r-[var(--border)] px-2"
            >{{ request.required_on && formatDate5(request.required_on) }}</span
          >
          <span :class="`${request.status.toLowerCase()} capitalize px-2`">{{
            request.status
          }}</span>
        </div>
      </template>

      <!-- Error state -->
      <div v-else-if="error" class="flex justify-center items-center py-8">
        <div class="text-red-500">
          Error loading requests. Please try again.
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="requestsData && requestsData.totalPages > 1"
      class="flex items-center justify-end mt-2"
    >
      <div class="flex items-center space-x-2 ml-auto">
        <!-- Previous button -->
        <button
          @click="goToPage(requestsData.page - 1)"
          :disabled="requestsData.page <= 1"
          :class="[
            'h-6 font-p3 w-6 flex items-center justify-center text-sm border rounded-[0.35rem] transition-colors',
            requestsData.page <= 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          <IconChevronLeft class="h-4 w-4" />
        </button>

        <!-- Page numbers -->
        <div class="flex items-center space-x-1">
          <template v-for="pageNum in getVisiblePages()" :key="pageNum">
            <button
              v-if="pageNum !== '...'"
              @click="goToPage(pageNum as number)"
              :class="[
                'h-6 font-p3 w-6 flex items-center justify-center text-sm border rounded-[0.35rem] transition-colors',
                pageNum === requestsData.page
                  ? 'bg-[#E7E7E4] border-[#C7C7C7]'
                  : 'hover:bg-gray-50 border-[#CFCFCF]',
              ]"
            >
              {{ pageNum }}
            </button>
            <span v-else class="px-2 text-gray-400">...</span>
          </template>
        </div>

        <!-- Next button -->
        <button
          @click="goToPage(requestsData.page + 1)"
          :disabled="requestsData.page >= requestsData.totalPages"
          :class="[
            'h-6 font-p3 w-6 flex items-center justify-center text-sm border rounded-[0.35rem] transition-colors',
            requestsData.page >= requestsData.totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          <IconChevronRght class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pending {
  color: #fcc11e;
}

.approved {
  color: #02b34c;
}

.rejected {
  color: #ec1414;
}
</style>
