<template>
   <div class="dropdown">
      <button
         class="btn btn-sm dropdown-toggle"
         type="button"
         id="dropdownMenuButton"
         data-bs-toggle="dropdown"
         aria-expanded="false"
         :style="{
            color: color,
            backgroundColor: isChild ? 'transparent' : color + '10',
            borderColor: isChild ? color : 'transparent',
            borderWidth: '2px',
         }"
      >
         employees
      </button>

      <!-- dropdown -->
      <ul
         v-if="employees.length"
         class="dropdown-menu dropdown-menu-end custom-dropdown-menu"
      >
         <div class="list-group w-100">
            <li
               v-for="employee in employees"
               :key="employee.id"
               class="custom-dropdown-item mb-3 d-flex align-items-center justify-content-between"
            >
               <div class="d-flex align-items-center">
                  <img
                     :src="employee.user.avatar || fallbackImg"
                     alt="avatar"
                     class="avatar avatar-md rounded-circle border"
                  />
                  <div class="ms-3">
                     <div class="fw-semibold fs-6 text-secondary">
                        {{ employee.user.name }}
                     </div>
                  </div>
               </div>
            </li>
         </div>
      </ul>
   </div>
</template>

<script setup lang="ts">
import fallbackImg from "@/assets/images/1.jpg";
import { Department } from "@/stores/Department";

defineProps<{
   department: Department;
   employees: Array<{ id: number; user: { name: string; avatar: string } }>;
   color?: string;
   isChild?: boolean;
}>();
</script>

<style scoped>
.custom-dropdown-menu {
   width: 250%;
   border-radius: 6px;
   padding: 15px;
   margin: 0;
   box-shadow: 0px 1px 4px 0px rgba(44, 44, 44, 25%);
}

.custom-dropdown-menu .list-group {
   max-height: 350px;
   overflow-y: auto;
   margin-right: -10px;
}

.custom-dropdown-item {
   display: flex;
   align-items: center;
}
.custom-dropdown-item:last-child {
   margin-bottom: 0 !important;
}
</style>
