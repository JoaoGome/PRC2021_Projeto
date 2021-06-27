import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Artists from '../views/Artists.vue'
import Albuns from '../views/Albuns.vue'
import Musics from '../views/Musics.vue'
import Dance from '../views/Dance.vue'
import Artist from '../views/Artist.vue'
import Album from '../views/Album.vue'
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
    name: 'Musics',
    component: Musics
  },
  {
    path: '/dance',
    name: 'Dance',
    component: Dance
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: Artist
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: Album
  },
  {
    path: '/music/:id',
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
