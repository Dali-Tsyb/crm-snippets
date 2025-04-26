import { ref } from "vue";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", () => {
   interface Task {
      id: number;
      name: string;
      status_id: number;
      assignee_id?: number | null;
      due_to?: string | null;
      created_at: string | Date;
   }

   const tasks = ref<Task[]>([
      {
         id: 1,
         name: "Fix bug on login page",
         status_id: 1,
         assignee_id: null,
         due_to: "2025-01-01 00:00:00",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 2,
         name: "Schedule meeting",
         status_id: 2,
         assignee_id: 1,
         due_to: "2025-04-25 00:00:00",
         created_at: "2025-04-25 00:00:00",
      },
      {
         id: 3,
         name: "Implement new feature",
         status_id: 3,
         assignee_id: 1,
         due_to: "2025-05-01 00:00:00",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 4,
         name: "Review code",
         status_id: 4,
         assignee_id: 2,
         created_at: "2023-01-01 00:00:00",
      },
   ]);

   return {
      tasks,
   };
});
