<template>
<div id="app">
  <Mplayer
    :src="currentSong.file"
    :play="play"
  ></Mplayer>
  <router-view></router-view>
  <router-view name="main"></router-view>
</div>
</template>

<script>
import eventBus from '@/eventBus.js'

import Mplayer from '@/components/Mplayer'
import playlist from '@/data/playlist.js'

export default {
  data () {
    return {
      currentIndex: 0,
      loopType: 'circle',
      play: true,
      playlist
    }
  },
  components: {
    Mplayer
  },
  computed: {
    currentSong () {
      return this.playlist[this.currentIndex]
    }
  },
  created () {
    eventBus.$on('ended', () => {
      this.next()
    })

    eventBus.$on('changeLoop', e => {
      this.loopType = e
    })
    eventBus.$on('changeState', (e) => {
      this.play = e
    })
    eventBus.$on('prev', () => {
      this.currentIndex === 0 ? this.currentIndex = this.playlist.length - 1 : this.currentIndex--
    })
    eventBus.$on('next', () => {
      this.next()
    })
    eventBus.$on('routeChange', () => {
      this.SendAppMeta()
    })
    eventBus.$on('changeSong', e => {
      let index = this.playlist.findIndex(item => {
        return item.id === e
      })
      this.currentIndex = index
      this.SendAppMeta()
    })
    eventBus.$on('deleteSong', e => {
      let index = this.playlist.findIndex(item => {
        return item.id === e
      })
      this.playlist.splice(index, 1)
      // if (index === this.currentIndex) this.next()
      this.SendAppMeta()
    })
  },
  methods: {
    SendAppMeta () {
      eventBus.$emit('AppMeta', {
        loopType: this.loopType,
        playlist: this.playlist,
        currentIndex: this.currentIndex,
        currentSong: this.currentSong,
        play: this.play
      })
    },
    next () {
      let randIndex = () => {
        let index = Math.round(Math.random() * this.playlist.length) - 1
        if (index === this.currentIndex) randIndex()
        else this.currentIndex = index
      }
      switch (this.loopType) {
        case 'circle':
        case 'single-circle':
          if (this.currentIndex < this.playlist.length - 1) this.currentIndex++
          else this.currentIndex = 0
          break
        case 'random':
          randIndex()
          break
      }
    }
  },
  mounted () {
    this.SendAppMeta()
  },
  watch: {
    'currentIndex' () {
      this.SendAppMeta()
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('update')
    next()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
}

body {
  font-size: 16px;
  background-image: radial-gradient(red,#ccc)
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

#app {
  display: flex;
  flex-direction: column;
}
</style>
