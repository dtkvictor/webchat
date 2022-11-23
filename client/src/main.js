import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'

createApp(App).use(store).use(router).mount('#app')
