<template>
   <td class="department-wrapper w-100 d-block" ref="parentRef">
      <!-- parent card -->
      <div class="department-card">
         <CardDepartment
            :department="department"
            :color="color"
            :selected-layout="selectedLayout"
            :isChild="isChild"
            :isTabOpen="isTabOpen"
            @toggleTab="handleTabToggle"
         />
      </div>

      <!-- children -->
      <transition name="tab-fade">
         <div
            v-if="isTabOpen"
            class="children-container list-group w-100"
            :style="{ borderColor: color }"
         >
            <DepartmentTabsLayout
               v-for="child in filteredDepartments"
               :key="child.id"
               :department="child"
               :selected-layout="selectedLayout"
               :color="color"
               :isChild="true"
               :calculateLineHeight="calculateLineHeight"
            />
         </div>
      </transition>
   </td>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from "vue";
import CardDepartment from "@/components/departments/CardDepartment.vue";
import DepartmentTabsLayout from "@/components/departments/DepartmentTabsLayout.vue";
import { useDepartmentStore } from "@/stores/Department";
import { Department } from "@/stores/Department";

const props = defineProps<{
   department: Department;
   selectedLayout: string;
   color?: string;
   isChild: boolean;
   calculateLineHeight: (
      parentRef: { value: HTMLElement | null },
      lineHeight: { value: number },
      index: number
   ) => void;
}>();

const isTabOpen = ref(false);

const departmentStore = useDepartmentStore();

const departments = ref<Department[]>(departmentStore.departments);

// getting all children
const children = ref<Department[]>(
   departments.value.filter((d) => d.parent_id === props.department.id)
);

const filteredDepartments = ref<Department[]>(
   children.value.sort((a, b) => a.order - b.order)
);

// observe changes in departments
watch(
   () => departmentStore.departments,
   () => {
      departments.value = departmentStore.departments;
      children.value = departments.value.filter(
         (d) => d.parent_id === props.department.id
      );
      filteredDepartments.value = children.value.sort(
         (a, b) => a.order - b.order
      );

      nextTick(() => {
         props.calculateLineHeight(parentRef, lineHeight, 11);
      });
   },
   { deep: true }
);

const lineHeight = ref(0);
const parentRef = ref<HTMLElement | null>(null);

let observer: MutationObserver | null = null;
let lastCardObserver: ResizeObserver | null = null;

// observe resizes to update line height
const observeResizes = () => {
   if (observer) observer.disconnect();

   observer = new MutationObserver(() => {
      props.calculateLineHeight(parentRef, lineHeight, 11);
   });

   lastCardObserver = new ResizeObserver(() => {
      props.calculateLineHeight(parentRef, lineHeight, 11);
   });

   const childrenContainer = parentRef.value?.querySelector(
      ".children-container"
   );
   if (childrenContainer) {
      observer.observe(childrenContainer, { childList: true, subtree: true });

      Array.from(childrenContainer.children).forEach((child) => {
         const lastCard = child.querySelector(
            ".department-wrapper > .department-card"
         );
         if (lastCard) {
            lastCardObserver?.observe(lastCard);
         }
      });
   }
};

// toggle tab visibility and update lines
const handleTabToggle = () => {
   isTabOpen.value = !isTabOpen.value;

   nextTick(() => {
      props.calculateLineHeight(parentRef, lineHeight, 11);
      if (isTabOpen.value) {
         observeResizes();
      } else {
         observer?.disconnect();
      }
   });
};

// on component mount
onMounted(() => {
   nextTick(() => {
      props.calculateLineHeight(parentRef, lineHeight, 11);
      observeResizes();
   });
});

// on component unmount
onUnmounted(() => {
   observer?.disconnect();
   lastCardObserver?.disconnect();
});
</script>

<style scoped>
.department-wrapper {
   width: auto !important;
}
.children-container {
   margin-left: 30px;
   position: relative;
   width: auto !important;
}
.children-container::before {
   content: "";
   position: absolute;
   top: 0;
   left: -20px;
   border: solid 1px;
   border-color: inherit;
   height: v-bind(lineHeight + "px");
}

.tab-fade-enter-active,
.tab-fade-leave-active {
   transition: opacity 0.3s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
   opacity: 0;
}

.tab-fade-enter-to,
.tab-fade-leave-from {
   opacity: 1;
}

@media (width < 768px) {
   .children-container {
      width: auto !important;
      margin-right: 15px;
   }
}
</style>
