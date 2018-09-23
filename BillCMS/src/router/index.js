import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Statis from '@/components/Statis'
import Ads from '@/components/Ads'
import Import from '@/components/Import'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Statis',
            component: Statis
        }, {
            path: '/login',
            name: 'Login',
            component: Login
        }, {
            path: '/ads',
            name: 'Ads',
            component: Ads
        }, {
            path: '/draw',
            name: 'Home',
            component: Home
        }, {
            path: '/import',
            name: 'Import',
            component: Import
        }
    ]
})
