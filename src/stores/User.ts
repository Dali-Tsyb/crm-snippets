import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
   const users = ref([
      {
         id: 1,
         name: "Kendrick Lamar",
         avatar: '/src/assets/images/Kendrick.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 2,
         name: "Frank Ocean",
         avatar: '/src/assets/images/Frank.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 3,
         name: "Eminem",
         avatar: '/src/assets/images/Eminem.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 4,
         name: "Sabrina Carpenter",
         avatar: '/src/assets/images/Sabrina.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 5,
         name: "Ariana Grande",
         avatar: '/src/assets/images/Ariana.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 6,
         name: "Slipknot",
         avatar: '/src/assets/images/Slipknot.png',
         created_at: "2023-01-01 00:00:00",
      },
      {
         id: 7,
         name: "System of a Down",
         avatar: '/src/assets/images/System.png',
         created_at: "2023-01-01 00:00:00",
      },
   ]);

   return {
      users,
   };
});
