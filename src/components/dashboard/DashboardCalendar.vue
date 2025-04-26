<template>
   <div
      class="card d-flex justify-content-center mb-0"
      style="border-radius: 0; min-height: 10rem"
   >
      <div class="row m-0 h-100">
         <div
            class="calendar d-flex flex-column align-items-center justify-content-between py-3"
            style="min-height: 10.4rem"
         >
            <!-- header with month and year -->
            <div class="calendar-header w-100">
               <div class="d-flex flex-column align-items-center">
                  <div
                     v-if="!editMonthAndYear"
                     class="fw-bold text-secondary fs-5"
                     @click.stop="editMonthAndYear = true"
                     title="Choose month and year"
                     style="cursor: pointer"
                  >
                     {{ formattedMonthYear }}
                  </div>
                  <div
                     v-else
                     class="d-flex align-items-center justify-content-center gap-2"
                     style="width: 20rem"
                     ref="editableMonthAndYear"
                  >
                     <v-select
                        id="custom-select"
                        :options="months"
                        placeholder="Month"
                        label="label"
                        :reduce="(month: any) => month.value"
                        v-model="selectedMonth"
                     >
                        <template #no-options>no options</template>
                     </v-select>
                     <v-select
                        id="custom-select"
                        :options="years"
                        placeholder="Year"
                        v-model="selectedYear"
                     >
                        <template #no-options>no options</template>
                     </v-select>
                  </div>
               </div>
               <div
                  class="return-btn"
                  @click="returnToToday"
                  title="Return to today"
               >
                  <i class="fa fa-undo"></i>
               </div>
            </div>

            <!-- calendar swiper -->
            <div
               class="d-flex align-items-center justify-content-between w-100"
               style="height: 6.4rem"
            >
               <button
                  class="btn btn-outline-secondary border-0 rounded-circle p-0"
                  style="width: 2rem; height: 2rem"
                  @click="prevSlide"
                  title="Previous week"
               >
                  <i class="fa fa-angle-left"></i>
               </button>

               <div class="w-100 h-100 overflow-hidden">
                  <swiper
                     ref="swiperRef"
                     :slides-per-view="1"
                     :space-between="0"
                     class="weekdays d-flex align-items-center justify-content-center h-100"
                  >
                     <swiper-slide
                        v-for="(week, index) in weeks"
                        :key="index"
                        class="week-wrapper h-100 d-flex align-items-center justify-content-center"
                     >
                        <div
                           class="week d-flex align-items-center justify-content-center gap-2"
                        >
                           <div
                              v-for="day in week"
                              :key="day.date.toISOString()"
                              class="day text-center rounded-circle d-flex flex-column align-items-center justify-content-center"
                              :class="{
                                 selected: isSelected(day.date),
                                 muted: day.muted,
                              }"
                              @click="selectDate(day.date)"
                           >
                              <div
                                 class="text-muted"
                                 :style="{
                                    fontSize: isSelected(day.date)
                                       ? '0.8rem'
                                       : '0.7rem',
                                 }"
                              >
                                 {{ day.day }}
                              </div>
                              <div
                                 class="fw-bold text-secondary"
                                 :style="{
                                    fontSize: isSelected(day.date)
                                       ? '1.5rem'
                                       : '1.2rem',
                                 }"
                              >
                                 {{ day.date.getDate() }}
                              </div>
                           </div>
                        </div>
                     </swiper-slide>
                  </swiper>
               </div>

               <button
                  class="btn btn-outline-secondary border-0 rounded-circle p-0"
                  style="width: 2rem; height: 2rem"
                  @click="nextSlide"
                  title="Next week"
               >
                  <i class="fa fa-angle-right"></i>
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const emit = defineEmits(["update:selectedDate"]);

const swiperRef = ref<InstanceType<typeof Swiper> | null>(null);
const editableMonthAndYear = ref<HTMLElement | null>(null);

const selectedDate = ref(new Date());
const selectedMonth = ref(selectedDate.value.getMonth());
const selectedYear = ref(selectedDate.value.getFullYear());
const editMonthAndYear = ref(false);

const months = [
   { label: "January", value: 0 },
   { label: "February", value: 1 },
   { label: "March", value: 2 },
   { label: "April", value: 3 },
   { label: "May", value: 4 },
   { label: "June", value: 5 },
   { label: "July", value: 6 },
   { label: "August", value: 7 },
   { label: "September", value: 8 },
   { label: "October", value: 9 },
   { label: "November", value: 10 },
   { label: "December", value: 11 },
];

const years = ref<number[]>([]);
const orgCreatedYear = 2023;

for (let year = orgCreatedYear; year <= new Date().getFullYear() + 30; year++) {
   years.value.push(year);
}

const formattedMonthYear = computed(() => {
   return `${months[selectedMonth.value].label} ${selectedYear.value}`;
});

const weeks = ref<any[]>([]);

const getStartOfWeek = (date: Date) =>
   date.getDay() === 0 ? 6 : date.getDay() - 1;
const getEndOfWeek = (date: Date) =>
   date.getDay() === 0 ? 0 : 7 - date.getDay();

const generateMonthWeeks = () => {
   const monthStart = new Date(selectedYear.value, selectedMonth.value, 1);
   const daysInMonth = new Date(
      selectedYear.value,
      selectedMonth.value + 1,
      0
   ).getDate();

   const startOffset = getStartOfWeek(monthStart);
   const endOffset = getEndOfWeek(
      new Date(selectedYear.value, selectedMonth.value, daysInMonth)
   );

   const prevMonthDays = [...Array(startOffset)].map((_, i) => {
      const day = new Date(
         selectedYear.value,
         selectedMonth.value - 1,
         i +
            1 +
            (new Date(
               selectedYear.value,
               selectedMonth.value - 1,
               0
            ).getDate() -
               startOffset)
      );
      return {
         date: day,
         day: day.toLocaleDateString("en-US", { weekday: "short" }),
         muted: true,
      };
   });

   const monthDays = [...Array(daysInMonth)].map((_, i) => {
      const day = new Date(selectedYear.value, selectedMonth.value, i + 1);
      return {
         date: day,
         day: day.toLocaleDateString("en-US", { weekday: "short" }),
         muted: false,
      };
   });

   const nextMonthDays = [...Array(endOffset)].map((_, i) => {
      const day = new Date(selectedYear.value, selectedMonth.value + 1, i + 1);
      return {
         date: day,
         day: day.toLocaleDateString("en-US", { weekday: "short" }),
         muted: true,
      };
   });

   const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays];
   weeks.value = [];

   for (let i = 0; i < allDays.length; i += 7) {
      weeks.value.push(allDays.slice(i, i + 7));
   }
};

const selectDate = (date: Date) => {
   selectedDate.value = new Date(date);
   selectedMonth.value = selectedDate.value.getMonth();
   selectedYear.value = selectedDate.value.getFullYear();
};

const isSelected = (date: Date) => {
   return date.toDateString() === selectedDate.value.toDateString();
};

const prevSlide = () => swiperRef.value?.$el?.swiper?.slidePrev();
const nextSlide = () => swiperRef.value?.$el?.swiper?.slideNext();

const returnToToday = () => {
   selectedDate.value = new Date();
   selectedMonth.value = selectedDate.value.getMonth();
   selectedYear.value = selectedDate.value.getFullYear();
   generateMonthWeeks();
   const todayIndex = weeks.value.findIndex((week) =>
      week.some((day: any) => day.date.toDateString() === new Date().toDateString())
   );
   swiperRef.value?.$el?.swiper?.slideTo(todayIndex);
};

onMounted(() => {
   generateMonthWeeks();
   returnToToday();

   document.addEventListener("click", (event) => {
      if (
         editMonthAndYear.value &&
         editableMonthAndYear.value &&
         !editableMonthAndYear.value.contains(event.target as Node)
      ) {
         editMonthAndYear.value = false;
         generateMonthWeeks();
         swiperRef.value?.$el?.swiper?.slideTo(0);
      }
   });
});

watch(selectedDate, (newDate) => {
   emit("update:selectedDate", newDate);
});
</script>

<style scoped>
.muted {
   opacity: 0.5;
   font-size: 0.9rem;
}
.weekdays {
   overflow: hidden;
}
.day-wrapper {
   display: flex;
   justify-content: center;
   height: 100%;
}
.day {
   cursor: pointer;
   height: 4.6rem;
   width: 4.6rem;
}
.day.selected {
   width: 5.5rem;
   height: 5.5rem;
   background: rgba(163, 163, 163, 0.262);
   border: 1px solid rgba(163, 163, 163, 0.412);
}
.day:hover {
   background: rgba(163, 163, 163, 0.262);
   scale: 1.1;
}
.day:active {
   background: rgba(163, 163, 163, 0.262);
   scale: 0.9;
}
.day,
.day * {
   transition: all 0.2s;
}
.calendar-header {
   position: relative;
}
.return-btn {
   position: absolute;
   right: 0;
   top: 0;
   height: 2rem;
   width: 2rem;
   border-radius: 50%;
   display: flex;
   justify-content: center;
   align-items: center;
   cursor: pointer;
   transition: background-color 0.2s, transform 0.6s ease-out;
}
.return-btn:hover {
   background-color: rgba(163, 163, 163, 0.262) !important;
   transform: rotate(-360deg);
}
.return-btn:active {
   background-color: rgba(163, 163, 163, 0.5) !important;
}

#custom-select * {
   border: none;
}

#custom-select > *:first-child {
   height: 2rem;
}

#custom-select > * {
   border: 0.0625rem solid #cccccc;
   min-width: 10rem;
}

#custom-select *::placeholder {
   color: #9b9b9b !important;
   font-size: 13px !important;
}
</style>
