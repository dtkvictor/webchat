import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const Home = () => import('@/app/view/Home.vue')
const Register = () => import('@/app/view/Register.vue')
const InternalError = () => import('@/app/view/Error.vue')

const routes = [
    { path:'/', name:'Home', component:Home },
    { path:'/cadastrar', name:'Register', component:Register },
    { path:'/error/:status?/:error?', name:'Error', component:InternalError },
]

const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {      
    if (to.name == 'Home' && !store.state.id) next({name:'Register'})
    else if (to.name == 'Register' && store.state.id) next({name:'Home'})    
    else next()
})

export default router