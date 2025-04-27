import { createRouter, createWebHistory } from "vue-router";
import MainPageView from "@/views/MainPageView.vue";
import DashboardView from "@/views/DashboardView.vue";
import DepartmentsView from "@/views/DepartmentsView.vue";

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      { path: "/", component: MainPageView },
      { path: "/dashboard", component: DashboardView },
      { path: "/departments", component: DepartmentsView },
   ],
});

export default router;
