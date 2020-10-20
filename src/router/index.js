import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComments from '../views/MyComments.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/edit',
      component: Edit
    },
    {
      path: '/my-follow',
      component: MyFollow
    },
    {
      path: '/my-comments',
      component: MyComments
    },
    {
      path: '/my-star',
      component: MyStar
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/detail/:id',
      component: Detail
    }
  ]
})

export default router

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  const authUrl = ['/user', '/edit']
  let token = localStorage.getItem('token')
  if (authUrl.includes(to.path)) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})