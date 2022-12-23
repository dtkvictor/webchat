import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'material-icons/iconfont/material-icons.css'
import '../src/assets/css/style.css'

const Vue = createApp(App);
Vue.directive('scrollTo', {
    updated(el) {        
        console.log(el)        
        el.scrollTop = el.scrollHeight        
    }
})

Vue.use(store).use(router).mount('#app')