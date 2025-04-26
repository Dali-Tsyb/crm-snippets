import { ref } from "vue";
import { defineStore } from "pinia";

export interface Department {
   id: number;
   name: string;
   parent_id?: number | null;
   parent?: Department;
   supervisor_id?: number | null;
   supervisor?: any;
   order: number;
   is_primary?: boolean;
}

export const useDepartmentStore = defineStore("department", () => {
   const departments = ref<Department[]>([
      {
         id: 1,
         name: "The best company ever",
         parent_id: null,
         order: 0,
         is_primary: true,
      },
      {
         id: 2,
         name: "Music",
         parent_id: 1,
         parent: {
            id: 1,
            name: "The best company ever",
            parent_id: null,
            order: 0,
            is_primary: true,
         },

         order: 0,
         is_primary: false,
      },
      {
         id: 3,
         name: "Rap",
         parent_id: 2,
         parent: {
            id: 2,
            name: "IT",
            parent_id: 1,
            order: 0,
            is_primary: false,
         },
         supervisor_id: 3,
         supervisor: {
            id: 3,
            name: "Eminem",
            avatar: "./avatars/Eminem.png",
            created_at: "2023-01-01 00:00:00",
         },
         order: 0,
         is_primary: false,
      },
      {
         id: 4,
         name: "Pop",
         parent_id: 2,
         parent: {
            id: 2,
            name: "IT",
            parent_id: 1,
            order: 0,
            is_primary: false,
         },
         order: 1,
         is_primary: false,
      },
      {
         id: 5,
         name: "Rock",
         parent_id: 2,
         parent: {
            id: 2,
            name: "IT",
            parent_id: 1,
            order: 0,
            is_primary: false,
         },
         order: 2,
         is_primary: false,
      },
      {
         id: 6,
         name: "Movies",
         parent_id: 1,
         parent: {
            id: 1,
            name: "The best company ever",
            parent_id: null,
            order: 0,
            is_primary: true,
         },
         order: 1,
         is_primary: false,
      },
      {
         id: 7,
         name: "Video Games",
         parent_id: 1,
         parent: {
            id: 1,
            name: "The best company ever",
            parent_id: null,
            order: 0,
            is_primary: true,
         },
         order: 2,
         is_primary: false,
      },
   ]);
   const departmentUsers = ref([
      {
         id: 1,
         user_id: 1,
         department_id: 3,
         user: {
            id: 1,
            name: "Kendrick Lamar",
            avatar: "./avatars/Kendrick.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 2,
         user_id: 2,
         department_id: 3,
         user: {
            id: 2,
            name: "Frank Ocean",
            avatar: "./avatars/Frank.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 3,
         user_id: 3,
         department_id: 3,
         user: {
            id: 3,
            name: "Eminem",
            avatar: "./avatars/Eminem.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 4,
         user_id: 4,
         department_id: 4,
         user: {
            id: 4,
            name: "Sabrina Carpenter",
            avatar: "./avatars/Sabrina.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 5,
         user_id: 5,
         department_id: 4,
         user: {
            id: 5,
            name: "Ariana Grande",
            avatar: "./avatars/Ariana.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 6,
         user_id: 6,
         department_id: 5,
         user: {
            id: 6,
            name: "Slipknot",
            avatar: "./avatars/Slipknot.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
      {
         id: 7,
         user_id: 8,
         department_id: 5,
         user: {
            id: 7,
            name: "System of a Down",
            avatar: "./avatars/System.png",
            created_at: "2023-01-01 00:00:00",
         },
      },
   ]);
   return {
      departments,
      departmentUsers,
   };
});
