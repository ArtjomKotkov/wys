import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {clickOutside} from "@/shared";


createApp(App)
    .use(store)
    .use(router)
    .directive("click-outside", clickOutside)
    .mount('#app')
