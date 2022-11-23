import {createRouter, createWebHistory } from 'vue-route'

const Home = () => import('./view/Home.vue')

const routes = [
    {path:'/', name:'Home', component:Home},
]

const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),
    routes
})

export default router