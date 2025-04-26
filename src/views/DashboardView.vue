<template>
   <div class="dashboard container py-4">
      <DashboardCalendar v-model:selectedDate="selectedDate" />
      <DashboardTasksOverview :selectedDate="selectedDate" />
   </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar.vue";
import DashboardTasksOverview from "@/components/dashboard/DashboardTasksOverview.vue";

const selectedDate = ref(new Date());
</script>
