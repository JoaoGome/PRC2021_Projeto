import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../views/Music.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/music',
    name: 'Music',
    component: Music
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
