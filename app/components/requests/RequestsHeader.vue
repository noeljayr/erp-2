<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import IconLoading from "../svg/IconLoading.vue";
import IconCheckCircle from "../svg/IconCheckCircle.vue";
import IconXCircle from "../svg/IconXCircle.vue";
import IconWalletOpen from "../svg/IconWalletOpen.vue";
import IconSearch from "../svg/IconSearch.vue";

const filters = ["Pending", "Approved", "Rejected"];
const selected = ref<string | null>(null);

// search term bound to input and kept in URL as `q`
const searchTerm = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

// debounce timer id for updating URL
let debounceTimer: number | null = null;
const DEBOUNCE_MS = 300;

const updateFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  selected.value = params.get("status")
    ? params.get("status")!.toLowerCase()
    : null;
  searchTerm.value = params.get("reach") ?? "";
};

// Update the URL to reflect current selected + searchTerm.
// useReplace: true -> history.replaceState (for typing), false -> pushState (if you want a new history entry)
const updateURL = (useReplace = true) => {
  const params = new URLSearchParams(window.location.search);

  if (searchTerm.value && searchTerm.value.trim() !== "") {
    params.set("search", searchTerm.value.trim());
  } else {
    params.delete("search");
  }

  if (selected.value) {
    params.set("status", selected.value);
  } else {
    params.delete("status");
  }

  // Reset to page 1 when filters change
  params.delete("page");

  const newSearch = params.toString();
  const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;

  if (useReplace) {
    history.replaceState(null, "", newUrl);
  } else {
    history.pushState(null, "", newUrl);
  }

  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent("urlParamsChanged"));
};

const toggleFilter = (filter: string | null) => {
  const params = new URLSearchParams(window.location.search);
  const current = params.get("status");

  if (filter === null) {
    params.delete("status");
    selected.value = null;
  } else if (current === filter.toLowerCase()) {
    params.delete("status");
    selected.value = null;
  } else {
    params.set("status", filter.toLowerCase());
    selected.value = filter.toLowerCase();
  }

  // Reset to page 1 when filter changes
  params.delete("page");

  const newSearch = params.toString();
  const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
  // use pushState here to create a meaningful history entry when filter changes
  history.pushState(null, "", newUrl);

  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent("urlParamsChanged"));
};

onMounted(() => {
  if (typeof window !== "undefined") {
    // init from current URL
    updateFromURL();

    // update when back/forward pressed
    window.addEventListener("popstate", updateFromURL);

    // keyboard shortcut: Ctrl+K or Cmd+K
    const onKeyDown = (e: KeyboardEvent) => {
      // support ctrl (Windows/Linux) and meta (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.value?.focus();
        inputRef.value?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // watch cleanup reference on unmount
    onBeforeUnmount(() => {
      window.removeEventListener("popstate", updateFromURL);
      window.removeEventListener("keydown", onKeyDown);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    });
  }
});

// watch the searchTerm and update the URL (debounced, uses replaceState)
watch(
  searchTerm,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      updateURL(true);
      debounceTimer = null;
    }, DEBOUNCE_MS);
  },
  { immediate: false }
);
</script>

<template>
  <div class="w-full items-center flex">
    <div class="w-fit flex items-center space-x-4">
      <span class="font-medium opacity-75">Requests</span>
      <div class="flex gap-2 items-center">
        <button
          @click="toggleFilter(null)"
          :class="[
            'border font-p3  font-medium p-1 px-2 space-x-1 flex items-center rounded-[0.3rem] transition-all duration-150',
            !selected
              ? 'bg-[#E7E7E4] border-[#C7C7C7]'
              : ' hover:bg-gray-50 border-[#CFCFCF]',
          ]"
        >
          <IconWalletOpen class="h-4 w-4" />

          <span class="font-semibold leading-[normal] cursor-default">All Requests</span>
        </button>

        <button
          v-for="filter in filters"
          :key="filter"
          @click="toggleFilter(filter)"
          :class="[
            'border border-[#CFCFCF] font-p3 font-medium p-1 pr-2 flex space-x-1 items-center rounded-[0.3rem] transition-all duration-150',
            selected === filter.toLowerCase()
              ? 'bg-[#E7E7E4] border-[#C7C7C7]'
              : ' hover:bg-gray-50 border-[#CFCFCF]',
          ]"
        >
          <IconLoading class="h-4 w-4" v-if="filter === 'Pending'" />
          <IconCheckCircle class="h-4 w-4" v-if="filter === 'Approved'" />
          <IconXCircle class="h-4 w-4" v-if="filter === 'Rejected'" />

          <span class="font-semibold leading-[normal]">{{ filter }}</span>
        </button>
      </div>
    </div>

    <div
      class="search ml-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 pl-2 pr-1 h-[2rem] border border-[#CFCFCF] rounded-[0.35rem] w-[16rem]"
    >
      <IconSearch class="h-4 w-4 opacity-50" />
      <input
        ref="inputRef"
        v-model="searchTerm"
        type="text"
        placeholder="Search"
        class="w-full h-full font-medium outline-none bg-transparent"
      />
      <span
        class="font-p4 px-2 h-[1.35rem] font-medium flex items-center bg-[#EDEDED] leading-[normal] border border-[#CFCFCF] rounded-[0.3rem]"
      >
        Ctrl/⌘ + K
      </span>
    </div>
  </div>
</template>

<style scoped>

</style>
