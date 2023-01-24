import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import InputComponent from '@/app/components/form/InputComponent'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'material-icons/iconfont/material-icons.css'
import '../src/assets/css/style.css'
import 'izitoast/dist/css/iziToast.min.css'

const Vue = createApp(App);

Vue.directive('scrollTo', {
    updated(el) {                
        el.scrollTop = el.scrollHeight        
    }
})

Vue.component('InputComponent', InputComponent)
Vue.use(store).use(router).mount('#app')