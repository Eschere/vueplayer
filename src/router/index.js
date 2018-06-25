import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Main from '@/components/Main'
import Lrc from '@/components/Lrc'
import Player from '@/components/Player'
import List from '@/components/List'

import eventBus from '@/eventBus.js'

Vue.use(Router)

const routes = [
  {
    path: '/',
    components: {
      default: Header,
      main: Main
    },
    children: [
      {
        path: '',
        name: 'Player',
        component: Player
      },
      {
        path: 'list',
        name: 'List',
        component: List
      },
      {
        path: 'lrc',
        name: 'Lrc',
        component: Lrc
      }
    ]
  }
]

let router = new Router({
  routes
})

router.beforeResolve((to, from, next) => {
  eventBus.$emit('routeChange')
  next()
})

export default router
