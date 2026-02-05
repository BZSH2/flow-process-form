import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";

const { BASE_URL } = import.meta.env

const router = createRouter({
  history: createWebHashHistory(BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
  ],
});

export default router;
