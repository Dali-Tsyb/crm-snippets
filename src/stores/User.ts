import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
   const users = ref([
      {
         id: 1,
         name: "Kendrick Lamar",
         avatar: "/avatars/Kendrick.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 2,
         name: "Frank Ocean",
         avatar: "/avatars/Frank.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 3,
         name: "Eminem",
         avatar: "/avatars/Eminem.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 4,
         name: "Sabrina Carpenter",
         avatar: "/avatars/Sabrina.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 5,
         name: "Ariana Grande",
         avatar: "/avatars/Ariana.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 6,
         name: "Slipknot",
         avatar: "/avatars/Slipknot.png",
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 7,
         name: "System of a Down",
         avatar: "/avatars/System.png",
         created_at: "2023-01-01 00:00:00",
      },
   ]);

   return {
      users,
   };
});
