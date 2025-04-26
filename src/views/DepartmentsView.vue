<template>
  <div class="m-3">
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="toggleLayout">Toggle view</button>
    </div>

    <div class="organization-tree">
      <table class="w-100">
        <tbody>
          <tr>
            <td colspan="6" class="organization" :class="{ 'parent-branch': selectedLayout === 'tree' }">
              <CardDepartment
                :department="departments.find((d: Department) => d.is_primary) || {}"
                :selected-layout="selectedLayout"
                :isChild="false"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- tree layout -->
      <table v-if="departments.length > 1 && selectedLayout === 'tree'" class="child-table">
        <tbody>
          <tr v-if="childDepartments.length > 1" class="line-connectors">
            <td
              v-for="(_, index) in childDepartments"
              :key="index"
              class="line-connector"
              @change="getLineConnectorLength"
            ></td>
          </tr>
          <tr>
            <DepartmentTreeLayout
              v-for="(department, index) in filteredDepartments"
              :key="department.id"
              :department="department"
              :color="getColor(index)"
              :style="{ borderColor: getColor(index) }"
              :selected-layout="selectedLayout"
              :isChild="false"
              :calculateLineHeight="calculateLineHeight"
              class="child-branch"
            />
          </tr>
        </tbody>
      </table>

      <!-- tabs layout -->
      <table v-if="departments.length > 1 && selectedLayout === 'list'" class="w-100">
        <tbody>
          <tr v-for="(department, index) in filteredDepartments" :key="department.id">
            <DepartmentTabsLayout
              :department="department"
              :color="getColor(index)"
              :style="{ borderColor: getColor(index) }"
              :selected-layout="selectedLayout"
              :isChild="false"
              :calculateLineHeight="calculateLineHeight"
              class="w-100"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue"
import { useDepartmentStore } from "@/stores/Department"
import CardDepartment from "@/components/departments/CardDepartment.vue"
import DepartmentTreeLayout from "@/components/departments/DepartmentTreeLayout.vue"
import DepartmentTabsLayout from "@/components/departments/DepartmentTabsLayout.vue"
import { Department } from "@/stores/Department"

const departmentStore = useDepartmentStore()

const departments = ref<Department[]>(departmentStore.departments)

const childDepartments = computed(() =>
  departments.value.filter(d => d.parent && d.parent.is_primary)
)

const filteredDepartments = computed(() =>
  [...childDepartments.value].sort((a, b) => a.order - b.order)
)

watch(
  () => departmentStore.departments,
  (newDepartments) => {
    departments.value = newDepartments
  },
  { deep: true }
)

const selectedLayout = ref<"tree" | "list">("tree")

const toggleLayout = () => {
  selectedLayout.value = selectedLayout.value === "tree" ? "list" : "tree"
}

// default layout for mobile
if (window.innerWidth < 768) {
  selectedLayout.value = "list"
}

// card colors
const colors = {
  borderColorBlue: "#0d99ff",
  borderColorRed: "#0F366A",
  borderColorGreen: "#20A868",
  borderColorOrange: "#F69546",
  borderColorPurple: "#8E71B7",
}

const getColor = (index: number) => {
  const colorKeys = Object.keys(colors)
  return colors[colorKeys[index % colorKeys.length] as keyof typeof colors]
}

// lines between cards
const lineConnectorLeft = ref(0)
const lineConnectorRight = ref(0)

const getLineConnectorLength = () => {
  const branches = document.querySelectorAll(".child-branch")
  if (branches.length > 0) {
    const firstChild = branches[0] as HTMLElement
    const lastChild = branches[branches.length - 1] as HTMLElement
    lineConnectorLeft.value = firstChild.offsetWidth / 2
    lineConnectorRight.value = lastChild.offsetWidth / 2
  }
}
const calculateLineHeight = (
  parentRef: { value: HTMLElement | null },
  lineHeight: { value: number },
  index: number
) => {
  if (!parentRef.value) return

  const childrenContainer = <HTMLElement> parentRef.value.querySelector(".children-container")
  if (childrenContainer) {
    const childElements = childrenContainer.children
    if (childElements.length > 0) {
      const lastChild = childElements[childElements.length - 1] as HTMLElement
      const lastCard = lastChild.querySelector(".department-wrapper > .department-card") as HTMLElement
      if (lastCard) {
        lineHeight.value =
          childrenContainer.offsetHeight -
          lastChild.offsetHeight +
          lastCard.offsetHeight / 2 +
          index
      }
    }
  }
}

// watching DOM changes
let observer: MutationObserver | null = null

onMounted(() => {
  nextTick(() => {
    getLineConnectorLength()
  })

  observer = new MutationObserver(() => {
    nextTick(() => {
      getLineConnectorLength()
    })
  })

  const treeElement = document.querySelector(".organization-tree")
  if (treeElement) {
    observer.observe(treeElement, { childList: true, subtree: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

const isMobile = computed(() => window.innerWidth < 768)
</script>



<style scoped>
.organization-tree {
   width: 100%;
   text-align: center;
}

.parent-branch {
   text-align: center;
   display: flex;
   justify-content: center;
   margin-bottom: 5px;
   position: relative;
}

/* vertical line under primary department */
.parent-branch::after {
   content: "";
   position: absolute;
   left: 50%;
   top: 100%;
   transform: translateX(-50%);
   width: 2px;
   height: 30px;
   background-color: #888888;
}

.child-table {
   margin: 25px auto;
}

/* vertical lines on the first level of a tree */
.line-connectors {
   position: relative;
   height: 30px;
}

.line-connectors::before {
   content: "";
   position: absolute;
   top: 0;
   left: v-bind('lineConnectorLeft + "px"');
   right: v-bind('lineConnectorRight + "px"');
   height: 2px;
   background-color: #888888;
}

.line-connector {
   position: relative;
}

.child-branch {
   padding: 0;
   vertical-align: top;
   text-align: center;
   position: relative;
}

.child-branch::after {
   content: "";
   position: absolute;
   width: 2px;
   height: 30px;
   top: -30px;
   left: 49.84%;
   background-color: #888888;
   z-index: 1;
}

@media (max-width: 768px) {
   .buttons {
      display: none;
   }

   .heading {
      padding: 2rem 1rem 0 1rem !important;
      font-size: 1.2rem !important;
   }

   .organization {
      border: none !important;
   }
}
</style>
