import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import WeekChartsComponent from "@/views/main-component/week-charts/week-charts.vue";
import ReportRedactorComponent from "@/views/main-component/report-redactor-component/report-redactor.vue";
import SettingsComponent from "@/views/main-component/settings/settings.vue";
import TokenParserComponent from "@/views/main-component/token/token-parser.vue";
import NewsComponent from "@/views/main-component/news.vue";


const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'news',
    component: NewsComponent,
  },
  {
    path: '/day/:date',
    name: 'report-redactor',
    component: ReportRedactorComponent,
  },
  {
    path: '/week/:dateRange',
    name: 'week-charts',
    component: WeekChartsComponent,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsComponent,
  },
  {
    path: '/report/:token',
    name: 'token',
    component: TokenParserComponent,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
