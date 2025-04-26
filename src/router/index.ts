import { createRouter, createWebHistory } from "vue-router";
import MainPageView from "@/views/MainPageView.vue";
import DashboardView from "@/views/DashboardView.vue";
import DepartmentsView from "@/views/DepartmentsView.vue";

const routes = [
   { path: "/", component: MainPageView },
   { path: "/dashboard", component: DashboardView },
   { path: "/departments", component: DepartmentsView },
];

export default createRouter({
   history: createWebHistory(),
   routes,
});
