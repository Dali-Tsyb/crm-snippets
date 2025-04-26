import { ref } from "vue";
import { defineStore } from "pinia";

export const useTaskStatusStore = defineStore("taskStatus", () => {
   const taskStatuses = ref([
      {
         id: 1,
         name: "To do",
         color: "#b0b0b0",
         type: "pending",
      },
      {
         id: 2,
         name: "In progress",
         color: "#2c4bd0",
         type: "progress",
      },
      {
         id: 3,
         name: "Done",
         color: "#3ac977",
         type: "success",
      },
      {
         id: 4,
         name: "Failed",
         color: "#fe5d5d",
         type: "failure",
      },
   ]);
   
   const statusTypes = [
      {
         value: "pending",
         text: "Запланирована",
      },
      {
         value: "progress",
         text: "В работе",
      },
      {
         value: "success",
         text: "Выполнена успешно",
      },
      {
         value: "failure",
         text: "Выполнена неудачно",
      },
   ];

   return {
      taskStatuses,
      statusTypes,
   };
});
