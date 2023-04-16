import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights'
import Roles from '@/components/rights/roles'
import Categories from '@/components/products/categories'
import Goods from '@/components/products/Goods'
import Add from '@/components/products/Add'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: Add
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
