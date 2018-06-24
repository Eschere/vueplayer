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
      play: true
    }
  },
  components: {
    Mplayer
  },
  computed: {
    currentSong () {
      return playlist[this.currentIndex]
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
      this.currentIndex === 0 ? this.currentIndex = playlist.length - 1 : this.currentIndex--
    })
    eventBus.$on('next', () => {
      this.next()
    })
  },
  methods: {
    SendAppMeta () {
      eventBus.$emit('AppMeta', {
        loopType: this.loopType,
        playlist,
        currentIndex: this.currentIndex,
        currentSong: this.currentSong,
        play: this.play
      })
    },
    next () {
      let randIndex = () => {
        let index = Math.round(Math.random() * playlist.length) - 1
        if (index === this.currentIndex) randIndex()
        else this.currentIndex = index
      }
      switch (this.loopType) {
        case 'circle':
        case 'single-circle':
          if (this.currentIndex < playlist.length - 1) this.currentIndex++
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
