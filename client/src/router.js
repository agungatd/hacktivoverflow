import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/question/:id',
      name: 'showQuestion',
      component: () => import(/* webpackChunkName: "about" */ './views/MainContaint.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
    },
    {
      path: '/question',
      name: 'question',
      component: () => import(/* webpackChunkName: "about" */ './views/AskQuestion.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import(/* webpackChunkName: "about" */ './views/Profile.vue')
    }
  ]
})
