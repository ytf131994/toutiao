import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Home from '@/views/home'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Images from '@/views/images'
import Comment from '@/views/comment'
import Setting from '@/views/setting'
import Fans from '@/views/fans'
Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        name: 'layout',
        component: Layout,
        children: [{
                path: '',
                name: 'home',
                component: Home
            }, {
                path: '/article',
                name: 'article',
                component: Article
            },
            {
                path: '/publish',
                name: 'publish',
                component: Publish
            },
            {
                path: '/images',
                name: 'images',
                component: Images
            },
            {
                path: '/comment',
                name: 'comment',
                component: Comment
            },
            {
                path: '/setting',
                name: 'setting',
                component: Setting
            },
            {
                path: '/fans',
                name: 'fans',
                component: Fans
            }
        ]
    }
]
const router = new VueRouter({
        routes
    })
    // 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') next()
        // 获取token值
    const tokenstr = window.sessionStorage.getItem('token')
        // 没有token值强制跳转到登录页面
    if (!tokenstr) return next('/login')
    next()
})
export default router
