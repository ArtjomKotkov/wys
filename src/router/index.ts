import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import WeekChartsComponent from "@/views/main-component/week-charts/week-charts.vue";
import ReportRedactorComponent from "@/views/main-component/report-redactor-component/report-redactor.vue";


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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
