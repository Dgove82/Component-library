import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {path:'/', component: ()=>import('@/App.vue')},
        {path:'/test', component: ()=>import('@/views/testDemo.vue')}

    ]
})

router.beforeEach((to, from, next) => {
    next();
})

export default router