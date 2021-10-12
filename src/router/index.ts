import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import WeekChartsComponent from "@/views/main-component/week-charts/week-charts.vue";
import ReportRedactorComponent from "@/views/main-component/report-redactor-component/report-redactor.vue";
import SettingsComponent from "@/views/main-component/settings/settings.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: '/day/:date',
    name: 'report-redactor',
    component: ReportRedactorComponent
  },
  {
    path: '/week/:dateRange',
    name: 'week-charts',
    component: WeekChartsComponent
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsComponent
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
