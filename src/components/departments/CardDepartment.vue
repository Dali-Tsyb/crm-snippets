<template>
  <!-- card -->
  <div v-show="selectedLayout === 'tree'" :style="{ display: isChild ? 'block' : 'flex', alignItems: 'stretch' }">
    <div v-show="!department.is_primary" :style="{ width: isChild ? '100%' : '20px', height: isChild ? '20px' : 'auto' }"></div>

    <div
      :class="['card', isChild ? 'child-card' : department.is_primary ? 'parent-card' : '']"
      :style="{
        borderColor: color,
        background: isChild ? color + '10' : 'var(--bs-body-bg)',
        width: isChild ? '281px' : '310px',
        height: '100%',
      }"
    >
      <div class="card-body card-top">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="card-title">{{ department.name }}</h6>
        </div>

        <div v-if="department.supervisor" class="mt-3 mb-3 d-flex align-items-center">
          <img
            :src="department.supervisor.avatar || fallbackImg"
            class="rounded-circle"
            alt="avatar"
            width="50"
            height="50"
          />
          <div class="ms-3 text-left">
            <h6 class="mb-0 text-start">{{ department.supervisor.name }}</h6>
          </div>
        </div>

        <!-- department employees -->
        <div
          v-if="employees?.length"
          class="card-footer"
          :style="{ borderColor: isChild ? color : 'var(--bs-body-color)' }"
        >
          <span class="text-start">employees</span>

          <div class="d-flex justify-content-between align-items-center">
            <!-- employee avatars -->
            <div class="mt-2 d-flex align-items-center position-relative employee-avatars">
              <div v-for="(user, index) in employees.slice(0, 6)" :key="index" class="position-relative employee-avatar">
                <img
                  :src="user.user.avatar || fallbackImg"
                  class="rounded-circle border"
                  alt="avatar"
                  :style="{ marginLeft: index !== 0 ? '-12px' : '0' }"
                />
              </div>

              <span v-if="employees.length > 6" class="count" :style="{ backgroundColor: color }">
                +{{ employees.length - 6 }}
              </span>
            </div>

            <!-- employees dropdown -->
            <DropdownDepartmentUsers
              :department="department"
              :employees="employees"
              :color="color"
              :isChild="isChild"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- tab -->
  <div v-show="selectedLayout === 'list'" @click="toggleTab">
    <div
      v-show="!department.is_primary"
      style="width: 100%; height: 20px"
    >
      <div class="dropping-line" style="width: 100%; height: 0"></div>
    </div>
    <div
      class="tab p-3 w-100 rounded-2 border-0 shadow-sm"
      :class="isChild ? 'child-tab' : ''"
      :style="{
        cursor: 'pointer',
        border: !department.is_primary ? '' : 'none',
        borderLeft: isMobile ? ' ' : 4 + 'px solid ' + color + ' !important',
        background: isChild ? color + '10' : 'var(--bs-body-bg)',
        borderColor: color + ' !important',
        position: 'relative',
      }"
      :draggable="false"
      ref="departmentTab"
    >
      <table class="w-100 table mb-0">
         <tbody>
            <tr class="d-flex">
          <td class="fw-semibold text-secondary card-title max-width tab-name text-start">
            {{ department.name }}
          </td>
          <td class="flex-grow-1">
            <div v-if="department.supervisor" class="d-flex align-items-center gap-3 mb-4 supervisor">
              <img
                :src="
                  department.supervisor.avatar ? department.supervisor.avatar : fallbackImg
                "
                alt="Avatar"
                class="avatar rounded-circle border"
                style="width: 50px; height: 50px"
              />
              <div>
                <div class="fw-semibold fs-5 text-secondary">{{ department.supervisor.name }}</div>
              </div>
            </div>
            <div v-if="employees?.length" class="d-flex align-items-center gap-5 flex-wrap">
              <div
                v-for="(employee, index) in isTabOpen ? employees : employees.slice(0, 6)"
                :key="index"
                class="d-flex align-items-center gap-3"
              >
                <img
                  :src="employee.user.avatar ? employee.user.avatar : fallbackImg"
                  alt="Avatar"
                  class="avatar avatar-md rounded-circle border"
                />
                <div>
                  <div class="fw-semibold fs-6 text-secondary text-start">{{ employee.user.name }}</div>
                </div>
              </div>
            </div>
          </td>
          <td class="d-flex gap-2 actions">
            <div :style="{ color: color }" class="d-flex gap-1">
              <span :style="{ color: color, paddingRight: 0 }" class="fw-semibold fs-6">{{ employees?.length }}</span>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                :style="{ color: color, paddingLeft: 0 }"
                stroke-width="1.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.79222 13.9396C12.1738 13.9396 15.0641 14.452 15.0641 16.4989C15.0641 18.5458 12.1931 19.0729 8.79222 19.0729C5.40972 19.0729 2.52039 18.5651 2.52039 16.5172C2.52039 14.4694 5.39047 13.9396 8.79222 13.9396Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.79223 11.0182C6.57206 11.0182 4.77173 9.21874 4.77173 6.99857C4.77173 4.7784 6.57206 2.97898 8.79223 2.97898C11.0115 2.97898 12.8118 4.7784 12.8118 6.99857C12.8201 9.21049 11.0326 11.0099 8.82064 11.0182H8.79223Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M15.1095 9.9748C16.5771 9.76855 17.7073 8.50905 17.7101 6.98464C17.7101 5.48222 16.6147 4.23555 15.1782 3.99997"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M17.0458 13.5045C18.4675 13.7163 19.4603 14.2149 19.4603 15.2416C19.4603 15.9483 18.9928 16.4067 18.2374 16.6936"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <div
              class="drag-button"
              v-if="!department.is_primary"
            >
              <button class="border-0 d-flex fs-5 bg-transparent handle" style="cursor: move" @click.stop>
                <i class="bi bi-three-dots-vertical" style="opacity: 0.3"></i>
                <i class="bi bi-three-dots-vertical" style="margin-left: -9px; opacity: 0.3"></i>
              </button>
            </div>
          </td>
            </tr>
         </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDepartmentStore } from '@/stores/Department'
import { Department } from '@/stores/Department'
import DropdownDepartmentUsers from '@/components/departments/DropdownDepartmentUsers.vue'
import fallbackImg from '@/assets/images/1.jpg'

const props = defineProps<{
  department: Department
  color?: string
  isChild?: boolean
  isTabOpen?: boolean
  selectedLayout: string
}>()

const emit = defineEmits<{
  (e: 'toggle-tab'): void
}>()

const departmentStore = useDepartmentStore()

const employees = computed(() =>
  departmentStore.departmentUsers.filter(user => user.department_id === props.department.id)
)

// toggle tab open/close
const toggleTab = () => {
  emit('toggle-tab')
  document.querySelectorAll('.child-tab').forEach(el => el.classList.toggle('d-flex'))
}

// mobile detection
const isMobile = computed(() => window.innerWidth < 768)
</script>


<style scoped>
td {
   border: none !important;
}

.card {
   border-radius: var(--bs-border-radius);
   border: 2px solid var(--bs-body-color);
   margin: 0;
}

.card-top {
   padding: 18px 16px 14px 14px;
   border-color: inherit;
}

.card-footer {
   display: flex;
   flex-direction: column;
   padding: 0;
   padding-top: 10px;
   margin: 0;
   border-color: inherit;
   border-width: 2px;
}

.card-footer img {
   display: block;
   width: 30px;
   height: 30px;
   max-width: 30px;
   max-height: 30px;
   padding: 0;
   margin: 0;
}

.card-footer .text-start {
   text-align: left !important;
}

.employee-avatars {
   position: relative;
}

.count {
   position: absolute;
   right: -10px;
   z-index: 2;
   color: white;
   border-radius: 50%;
   width: 30px;
   height: 30px;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 12px;
}

.dropdown-menu {
   height: 200px;
}

.child-card::before {
   content: "";
   position: absolute;
   top: 50%;
   left: -20px;
   border: solid 1px;
   width: 20px;
   border-color: inherit;
}

/* ВКЛАДКА */
.tab *:not(.custom-dropdown-menu) {
   background: transparent;
}

.tab-name {
   width: 25% !important;
   flex-shrink: 0;
}

.child-tab {
   position: relative;
}

.child-tab::before {
   content: "";
   position: absolute;
   top: 50%;
   left: -24px;
   border: solid 1px;
   width: 20px;
   border-color: inherit;
}

@media (max-width: 768px) {
   .tab {
      position: relative;
      border-top: 4px solid !important;
   }

   .tab > * > .d-flex {
      flex-direction: column;
   }

   .tab .actions {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
   }

   .tab .supervisor {
      padding-bottom: 25px;
      border-bottom: 2px solid #cccccc !important;
   }

   .child-tab::before {
      left: -20px;
   }
}
</style>
