import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const Chat = () => import('@/app/view/Chat.vue')
const Register = () => import('@/app/view/Register.vue')
const InternalError = () => import('@/app/view/Error.vue')

const routes = [
    { path:'/', name:'Chat', component:Chat },
    { path:'/cadastrar', name:'Register', component:Register },
    { path:'/error', name:'Error', component:InternalError },
]

const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {      
    if (to.name == 'Chat' && !store.state.id) next({name:'Register'})
    else if (to.name == 'Register' && store.state.id) next({name:'Chat'})    
    else next()
})

export default router