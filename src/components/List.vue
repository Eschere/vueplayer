<template>
  <ul>
    <div
      class="back"
      @touchend="$router.go(-1)"
    >&lt;</div>
    <li
      v-for="(song,index) in playlist"
      :key="song.id"
      :class="{active:index === currentIndex}"
      @click="changeSong(song.id)"
    >
      <span>{{ song.title }} - {{ song.artist }}</span>
      <i @click.stop="deleteSong(song.id)">&times;</i>
    </li>
  </ul>
</template>

<script>
import eventBus from '@/eventBus.js'

export default {
  data () {
    return {
      currentIndex: 0,
      playlist: null
    }
  },
  beforeRouteEnter (to, from, next) {
    let _playlist, _currentIndex

    eventBus.$on('AppMeta', ({playlist, currentIndex}) => {
      _playlist = playlist
      _currentIndex = currentIndex
    })
    next((vm) => {
      vm.playlist = _playlist
      vm.currentIndex = _currentIndex
    })
  },
  created () {
    eventBus.$on('AppMeta', ({playlist, currentIndex}) => {
      this.playlist = playlist
      this.currentIndex = currentIndex
    })
  },
  methods: {
    changeSong (e) {
      eventBus.$emit('changeSong', e)
    },
    deleteSong (e) {
      eventBus.$emit('deleteSong', e)
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 20px;
  .back {
    font-size: 25px;
    color:white;
  }
  li {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    align-items: center;
  }
  li.active {
    color:rgb(86, 139, 86);
  }
}
</style>
