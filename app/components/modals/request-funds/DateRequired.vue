<script setup lang="ts">
import IconCheck from "~/components/svg/IconCheck.vue";
import { AnimatePresence, motion } from "motion-v";
import { useRequestFormData } from "#imports";
import IconCalendar from "~/components/svg/IconCalendar.vue";
import IconChevronRght from "~/components/svg/IconChevronRght.vue";
import IconChevronLeft from "~/components/svg/IconChevronLeft.vue";
import { ref, computed } from "vue";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameDay,
  isBefore,
} from "date-fns";
import { formatDate3 } from "#imports";
import IconChevronDown from "~/components/svg/IconChevronDown.vue";

const today: Date = new Date();
const currentMonth: Ref<Date> = ref(startOfMonth(today));
const selectedDate: Ref<Date | ""> = ref("");

const shortWeekdays: string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const show = ref(false);
const setShow = (val: boolean) => {
  show.value = val;
};

const calendarDays = computed<Date[]>(() => {
  const start: Date = startOfWeek(startOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  });
  const end: Date = endOfWeek(endOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  });
  const days: Date[] = [];
  let cursor: Date = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
});

const isAtStartMonth = computed<boolean>(
  () => format(currentMonth.value, "yyyy-MM") === format(today, "yyyy-MM")
);

function goToPrevMonth(): void {
  if (!isAtStartMonth.value) {
    currentMonth.value = addMonths(currentMonth.value, -1);
  }
}

function goToNextMonth(): void {
  currentMonth.value = addMonths(currentMonth.value, 1);
}

function selectDate(day: Date): void {
  selectedDate.value = day;
  if (selectedDate.value.toString().length > 0) {
    formData.setRequiredOn(selectedDate.value.toISOString());
    setShow(false);
  } else {
    formData.setRequiredOn(null);
  }
}

type PresetType = "today" | "tomorrow" | "week" | "twoWeeks";

function getPresetDate(type: PresetType): Date {
  switch (type) {
    case "today":
      return today;
    case "tomorrow":
      return addDays(today, 1);
    case "week":
      return addDays(today, 7);
    case "twoWeeks":
      return addDays(today, 14);
    default:
      return today;
  }
}

function isPresetActive(type: PresetType): boolean {
  return (
    selectedDate.value instanceof Date &&
    isSameDay(selectedDate.value, getPresetDate(type))
  );
}

function selectPreset(type: PresetType): void {
  const d = getPresetDate(type);
  selectDate(d);
  currentMonth.value = startOfMonth(d);
  setShow(false);
}

const containerRef = ref<HTMLElement | null>(null);
useClickOutside(containerRef, () => setShow(false));
const formData = useRequestFormData();
</script>

<template>
  <div ref="containerRef" class="relative flex select-none">
    <button
      type="button"
      @click="setShow(!show)"
      class="border relative border-[#CFCFCF] leading-[normal] font-p2 font-medium p-1.5 pr-2.5 flex space-x-1 items-center rounded-[0.4rem] transition-all duration-150 hover:bg-gray-50 border-[#CFCFCF"
    >
      <IconCalendar class="h-4 w-4 mr-1" />
      <span class="leading-[normal]">{{
        formData.required_on && formData.required_on.length > 0
          ? formatDate3(formData.required_on)
          : "Date required"
      }}</span>
      <IconChevronDown class="h-3.5 w-3.5 ml-1" />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="show"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="motionTransition({ duration: 0.25 })"
        class="popup font-p2"
        style="width: 20.5rem"
      >
        <span
          class="w-full font-medium opacity-50 border-b py-2 px-4 font-p2 mb-1"
          >When funds are required (optional)</span
        >
        <div class="flex flex-col w-full px-2">
          <div class="presets gap-2 font-p3">
            <button
              type="button"
              @click="selectPreset('tomorrow')"
              :class="{ active: isPresetActive('tomorrow') }"
            >
              Tomorrow
            </button>
            <button
              type="button"
              @click="selectPreset('week')"
              :class="{ active: isPresetActive('week') }"
            >
              In a week
            </button>
            <button
              type="button"
              @click="selectPreset('twoWeeks')"
              :class="{ active: isPresetActive('twoWeeks') }"
            >
              In two Weeks
            </button>
          </div>

          <div class="flex flex-col gap-1">
            <div class="month-nav">
              <button
                type="button"
                @click="goToPrevMonth"
                :disabled="isAtStartMonth"
              >
                <IconChevronLeft class="h-3 w-3" />
              </button>
              <span class="month-title sora">{{
                format(currentMonth, "MMMM, yyyy")
              }}</span>
              <button type="button" @click="goToNextMonth">
                <IconChevronRght class="h-3 w-3" />
              </button>
            </div>

            <!-- Weekday headings -->
            <div class="weekdays opacity-50 font-p3">
              <div
                v-for="d in shortWeekdays"
                :key="d"
                class="weekday font-semibold"
              >
                {{ d }}
              </div>
            </div>

            <!-- Calendar grid -->
            <div class="days-grid">
              <div
                v-for="day in calendarDays"
                :key="day.toString()"
                class="day sora"
                :class="{
                  disabled: isBefore(day, today),
                  selected: isSameDay(day, selectedDate),
                }"
                @click="!isBefore(day, today) && selectDate(day)"
              >
                {{ format(day, "d") }}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
}
.presets {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}
.presets button {
  flex: 1;
  padding: 0.25rem;
  border: none;
  border-radius: 0.35rem;
  cursor: pointer;
  border: 1px solid var(--border);
  font-weight: 600;
  transition: var(--transition);
}
.presets .skip-btn {
  border: 1px solid transparent;
  background-color: var(--primary);
  color: var(--text-white);
  border-radius: var(--radius-s);
}
.presets button:hover {
  background: #e0e0e0;
}

.presets .skip-btn:hover {
  background: var(--primary);
  filter: var(--cta-hover);
}
.presets button.active {
  background: var(--primary);
  color: #fff;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}
.month-nav button {
  background: none;
  border: none;
  cursor: pointer;
}
.month-nav button:disabled {
  opacity: 0.3;
  cursor: default;
}
.month-title {
  width: 100%;
  text-align: center;
  font-weight: bold;
}

.weekdays,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 1rem;
  row-gap: 0rem;
}
.weekday {
  text-align: center;
  padding-bottom: 0.25rem;
}

.day {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0.1rem 0;
  cursor: pointer;
  border-radius: 50%;
  line-height: 0;
  transition: var(--transition);
  border: 1px solid transparent;
}
.day.disabled {
  color: #ccc;
  cursor: default;
}
.day.selected {
  background: rgba(20, 89, 147, 0.1);
  border: 1px solid rgba(20, 89, 147, 0.1);
  color: var(--primary);
  font-weight: bold;
}
.day:not(.disabled):hover {
  background: #ddd;
}
</style>
