<template>
   <td class="department-wrapper" ref="parentRef">
      <!-- parent card -->
      <div class="department-card" :data-departmentId="department.id">
         <CardDepartment
            :department="department"
            :color="color"
            :selected-layout="selectedLayout"
            :isChild="isChild"
         />
      </div>

      <!-- children -->
      <div
         v-if="filteredDepartments.length > 0"
         :class="[
            { 'children-container': filteredDepartments.length },
            'list-group',
         ]"
         :style="{ borderColor: color }"
      >
         <DepartmentTreeLayout
            v-for="child in filteredDepartments"
            :key="child.id"
            :department="child"
            :selected-layout="selectedLayout"
            :color="color"
            :isChild="true"
            :calculateLineHeight="calculateLineHeight"
         />
      </div>
   </td>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from "vue";
import CardDepartment from "@/components/departments/CardDepartment.vue";
import { useDepartmentStore } from "@/stores/Department";
import { Department } from "@/stores/Department";

const props = defineProps<{
   department: Department;
   selectedLayout: string;
   color?: string;
   isChild: boolean;
   calculateLineHeight: (
      parentRef: any,
      lineHeight: any,
      index: number
   ) => void;
}>();

const emit = defineEmits(["drag-start"]);

const departmentStore = useDepartmentStore();

const departments = ref(departmentStore.departments);

// getting all children
const children = ref(
   departments.value.filter((d: any) => d.parent_id === props.department.id)
);

const filteredDepartments = ref(
   children.value.sort((a: any, b: any) => a.order - b.order)
);

const lineHeight = ref(0);
const parentRef = ref<HTMLElement | null>(null);

let observer: MutationObserver | null = null;
let lastCardObserver: ResizeObserver | null = null;

// observe resizes to update lines
const observeResizes = () => {
   if (observer) observer.disconnect();

   observer = new MutationObserver(() => {
      props.calculateLineHeight(parentRef, lineHeight, 12);
   });

   lastCardObserver = new ResizeObserver(() => {
      props.calculateLineHeight(parentRef, lineHeight, 12);
   });

   const childrenContainer = parentRef.value?.querySelector(
      ".department-wrapper"
   );
   if (childrenContainer) {
      observer.observe(childrenContainer, { childList: true, subtree: true });

      document.querySelectorAll(".department-wrapper > *").forEach((child) => {
         const lastCard = child.querySelector(
            ".department-wrapper > .department-card"
         );
         if (lastCard) {
            lastCardObserver?.observe(lastCard);
         }
      });
   }
};

// update departments when store changes
watch(
   () => departmentStore.departments,
   () => {
      departments.value = departmentStore.departments;
      children.value = departments.value.filter(
         (d: any) => d.parent_id === props.department.id
      );
      filteredDepartments.value = children.value.sort(
         (a: any, b: any) => a.order - b.order
      );

      nextTick(() => {
         props.calculateLineHeight(parentRef, lineHeight, 12);
      });
   },
   { deep: true }
);

// mount component
onMounted(() => {
   nextTick(() => {
      props.calculateLineHeight(parentRef, lineHeight, 12);
      observeResizes();
   });
});

// unmount component
onUnmounted(() => {
   observer?.disconnect();
   lastCardObserver?.disconnect();
});
</script>

<style scoped>
.children-container {
   margin-left: 50px;
   position: relative;
}
.children-container::before {
   content: "";
   position: absolute !important;
   top: 0;
   left: -20px;
   height: v-bind(lineHeight + "px");
   border: solid 1px;
   border-color: inherit;
}
</style>
