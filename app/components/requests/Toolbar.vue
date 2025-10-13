<script setup lang="ts">
import IconPlus from '../svg/IconPlus.vue';
import IconExport from '../svg/IconExport.vue';
import { openModal } from '#imports';
import { BASE_URL } from '~/constants/base-url';
import Loader from '../ux/Loader.vue';

const token = useAuthStore();

const exportLoading = ref(false);

const exportToExcel = async () => {
  exportLoading.value = true;
  try {
    const response = await fetch(`${BASE_URL}/requests/export/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'approved-requests.xlsx';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
  } finally {
    exportLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full items-center flex">
    <button
      @click="openModal('new-request', 'true')"
      class="flex items-center gap-2 font-medium leading-[normal] font-p2"
    >
      <IconPlus class="h-4 w-4" /> New request
    </button>

    <button
      @click="exportToExcel"
      v-if="token.role === 'Partner'"
      class="border ml-auto border-[#CFCFCF] leading-[normal] font-p3 font-medium p-1 pr-2 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <Loader variant="primary" v-if="exportLoading" class="h-4 w-4" />
      <template v-else>
        <IconExport class="h-4 w-4 mr-1" />
        Export
      </template>
    </button>
  </div>
</template>

<style scoped></style>
