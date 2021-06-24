import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Artists from '../views/Artists.vue'
import Albuns from '../views/Albuns.vue'
import Music from '../views/Music.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/artists',
    name: 'Artists',
    component: Artists
  },
  {
    path: '/albuns',
    name: 'Albuns',
    component: Albuns
  },
  {
    path: '/music',
    name: 'Music',
    component: Music
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
