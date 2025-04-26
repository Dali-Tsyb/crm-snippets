<template>
   <div class="card p-5 m-0 d-flex justify-content-center align-items-center">
      <div class="d-flex flex-row justify-content-between w-100">
         <!-- employees workload -->
         <div
            class="d-flex flex-column align-items-center justify-content-center w-100"
         >
            <div
               class="task-employees-container d-flex flex-column align-items-center justify-content-center"
               style="max-width: 35rem"
            >
               <h5 class="card-title text-center mb-3">Workload</h5>
               <div
                  v-if="filteredUsers.length === 0"
                  class="text-center text-muted h-100 d-flex align-items-center justify-content-center"
               >
                  No data
               </div>
               <table v-else class="users-list table table-borderless">
                  <tbody>
                     <tr v-for="user in filteredUsers" :key="user.id">
                        <td class="d-flex align-items-center gap-2 text-wrap">
                           <img
                              :src="user.avatar || fallbackImg"
                              alt=""
                              class="avatar rounded-circle avatar-xs"
                           />
                           <span class="fw-bold text-secondary">{{
                              user.name
                           }}</span>
                        </td>
                        <td>
                           <div class="progress">
                              <div
                                 class="progress-bar"
                                 role="progressbar"
                                 :style="{
                                    width:
                                       (animatedTaskPercentages[user.id] || 0) +
                                       '%',
                                 }"
                                 :aria-valuenow="
                                    animatedTaskPercentages[user.id]
                                 "
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                              >
                                 {{ animatedTaskPercentages[user.id] }}%
                              </div>
                           </div>
                        </td>
                        <td>
                           <button
                              @click.stop="assignTask(user.id)"
                              class="btn btn-sm text-primary"
                           >
                              Assign task
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

         <div style="width: 1px; background-color: #e6e6e6"></div>

         <!-- tasks overview -->
         <div
            class="d-flex flex-column align-items-center justify-content-center w-100"
         >
            <div
               class="task-chart-container d-flex flex-wrap justify-content-center align-items-start gap-5"
            >
               <h5 class="card-title text-center mb-3 w-100">Tasks Overview</h5>

               <div
                  v-if="taskStore.isLoading"
                  class="text-center text-muted py-5"
               >
                  Loading...
               </div>
               <div
                  v-else-if="filteredTasks.length === 0"
                  class="text-center text-muted py-5"
               >
                  No data
               </div>

               <div v-else class="pb-2">
                  <div
                     ref="tasksChartRef"
                     class="h-100"
                     style="max-width: 20rem"
                  ></div>
               </div>

               <div class="task-overview">
                  <div
                     class="task-item d-flex align-items-center gap-2 py-3"
                     v-for="item in taskStatusCounts"
                     :key="item.label"
                  >
                     <i :class="item.icon + ' fs-5 ' + item.color"></i>
                     <span
                        :class="
                           'task-number ' + item.color + ' fw-bold px-2 rounded'
                        "
                        >{{ item.count }}</span
                     >
                     <span class="task-label fs-6">{{ item.label }}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- add task buttons -->
      <div class="d-flex gap-3 mt-5 justify-content-center">
         <button
            v-for="btn in addTaskButtons"
            :key="btn.label"
            @click.stop="addTask(btn.status, btn.date)"
            class="btn btn-sm btn-secondary light"
         >
            {{ btn.label }}
         </button>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import ApexCharts from "apexcharts";
import { useTaskStore } from "@/stores/Task";
import { useTaskStatusStore } from "@/stores/TaskStatus";
import { useUserStore } from "@/stores/User";
import fallbackImg from "@/assets/images/1.jpg";

const props = defineProps<{
   selectedDate: Date;
}>();

const taskStore = useTaskStore();
const taskStatusStore = useTaskStatusStore();
const userStore = useUserStore();

const tasksChartRef = ref<HTMLElement | null>(null);
const tasksChartInstance = ref<ApexCharts | null>(null);

const addTask = (status_id: number | null, due_to: string | null | undefined) => {
   taskStore.tasks.push({
      id: taskStore.tasks.length + 1,
      name: "New task",
      due_to: due_to,
      status_id: status_id || 1,
      created_at: new Date(),
   });
};

const assignTask = (user_id: number) => {
   const task =
      taskStore.tasks.find((task) => !task.assignee_id) ||
      taskStore.tasks.find((task) => task.assignee_id !== user_id);
   if (task) {
      task.assignee_id = user_id;
   }
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const filteredTasks = computed(() => {
   if (!props.selectedDate) return taskStore.tasks;
   const selected = formatDate(props.selectedDate);
   return taskStore.tasks.filter(
      (task) => formatDate(new Date(task.created_at)) <= selected
   );
});

const filteredUsers = computed(() => {
   if (!props.selectedDate) return userStore.users;
   const selected = formatDate(props.selectedDate);
   return userStore.users.filter(
      (user) => formatDate(new Date(user.created_at)) <= selected
   );
});

const tasksOverdue = computed(() =>
   filteredTasks.value.filter(
      (task) =>
         task.due_to &&
         formatDate(new Date(task.due_to)) < formatDate(props.selectedDate)
   )
);

const tasksDueToday = computed(() =>
   filteredTasks.value.filter(
      (task) =>
         task.due_to &&
         formatDate(new Date(task.due_to)) === formatDate(props.selectedDate)
   )
);

const tasksInProgress = computed(() =>
   filteredTasks.value.filter((task) => {
      const status = taskStatusStore.taskStatuses.find(
         (s) => s.id === task.status_id
      );
      return status?.type === "progress";
   })
);

const animatedTaskPercentages = ref<Record<number, number>>({});
const taskPercentages = computed(() => {
   const total = filteredTasks.value.length;
   const result: Record<number, number> = {};
   if (total === 0) return result;
   filteredUsers.value.forEach((user) => {
      const count = filteredTasks.value.filter(
         (task) => task.assignee_id === user.id
      ).length;
      result[user.id] = Math.round((count / total) * 100);
   });
   return result;
});

const chartData = computed(() => {
   const labels: string[] = [];
   const series: number[] = [];
   const colors: string[] = [];

   taskStatusStore.taskStatuses.forEach((status) => {
      labels.push(status.name);
      series.push(
         filteredTasks.value.filter((task) => task.status_id === status.id)
            .length
      );
      colors.push(status.color || "#000");
   });

   return { labels, series, colors };
});

const initChart = () => {
   if (!tasksChartRef.value) return;

   if (tasksChartInstance.value) {
      tasksChartInstance.value.destroy();
   }

   tasksChartInstance.value = new ApexCharts(tasksChartRef.value, {
      chart: { type: "donut" },
      labels: chartData.value.labels,
      series: chartData.value.series,
      colors: chartData.value.colors,
      dataLabels: { enabled: false },
      tooltip: { enabled: false },
      plotOptions: {
         pie: {
            donut: {
               labels: {
                  show: true,
                  name: { offsetY: 15, fontSize: "12px" },
                  value: { offsetY: -15, fontWeight: "bold" },
               },
            },
         },
      },
      legend: { position: "bottom", markers: { shape: "circle" } },
   });

   tasksChartInstance.value.render();
};

onMounted(async () => {
   await nextTick();
   animatedTaskPercentages.value = { ...taskPercentages.value };
   initChart();
});

watch(
   [() => chartData.value, () => taskStore.tasks],
   async () => {
      await nextTick();
      initChart();
      animatedTaskPercentages.value = { ...taskPercentages.value };
   },
   { deep: true }
);

const addTaskButtons = [
   { label: "Add 'to do' task", status: 1, date: null },
   { label: "Add 'in progress' task", status: 2, date: null },
   { label: "Add 'done' task", status: 3, date: null },
   { label: "Add 'failed' task", status: 4, date: null },
   {
      label: "Add 'overdue' task",
      status: null,
      date: new Date(Date.now() - 86400000),
   },
   { label: "Add 'due today' task", status: null, date: new Date() },
];

const taskStatusCounts = computed(() => [
   {
      label: "Overdue",
      count: tasksOverdue.value.length,
      icon: "fa-solid fa-circle-exclamation",
      color: "text-danger",
   },
   {
      label: "Due today",
      count: tasksDueToday.value.length,
      icon: "fa fa-calendar",
      color: "text-warning",
   },
   {
      label: "In progress",
      count: tasksInProgress.value.length,
      icon: "fa fa-spinner",
      color: "text-primary",
   },
]);
</script>

<style scoped>
.card {
   max-height: -webkit-fill-available;
   width: 100%;
   border-radius: 0;
   border-top: none;
}

.task-overdue,
.task-due-today,
.tasks-in-progress {
   display: flex;
   align-items: center;
   gap: 0.5rem;
}
.task-overdue span,
.task-due-today span,
.tasks-in-progress span {
   background-color: #e6e6e6;
   font-weight: bold;
   font-size: 1.7rem;
   height: 3rem;
   width: 3rem;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
}

.task-item {
   padding: 8px 0;
   border-bottom: 1px solid #eee;
}

.task-item:last-child {
   border-bottom: none;
}

.task-number {
   font-size: 1.2rem;
   min-width: 32px;
   text-align: center;
   display: inline-block;
}

.progress-bar {
   background-color: #007bff;
   transition: width 0.6s ease-in-out;
}

.progress {
   background-color: #e7e7e7;
   min-width: 80px;
   max-width: 100%;
   height: 20px;
}

.users-list {
   max-height: 100%;
   width: 100%;
   table-layout: fixed;
   overflow-y: auto;
}
.users-list td {
   max-width: 100%;
}
.users-list td:first-child {
   white-space: normal;
   word-break: break-word;
   max-width: fit-content;
}
</style>
