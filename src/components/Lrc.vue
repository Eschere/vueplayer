<template>
<div
  ref="box"
  @touchmove="pausedLrc"
>
  <ul ref="lrc" v-cloak>
    <li
      v-for="item in lrclist"
      :key="item.index"
      :class="{active: activeIndex === item.index}"
    >
      {{ item.text }}
    </li>
  </ul>
</div>
</template>
<script>
import eventBus from '@/eventBus.js'
import fun from '@/common/common.fn.js'

export default {
  data () {
    return {
      lrc: null,
      currentTime: 0,
      lrclist: [],
      lastIndex: 0,
      play: false
    }
  },
  beforeRouteEnter (to, from, next) {
    let _currentSong, _play
    eventBus.$once('AppMeta', ({currentSong, play}) => {
      _currentSong = currentSong
      _play = play
    })
    next(vm => {
      vm.lrc = _currentSong.lrc
      vm.play = _play
      fun.lrcContrl.open()
      fun.lrcContrl(vm.$refs.box, vm.$refs.lrc, 10, vm.lastIndex + 1, vm.activeIndex, false)
    })
  },
  created () {
    eventBus.$on('AppMeta', ({currentSong, play}) => {
      this.lrc = currentSong.lrc
      this.play = play
    })
    eventBus.$on('currentTime', e => {
      this.currentTime = e
    })
    eventBus.$emit('lrcOn')
  },
  watch: {
    lrc () {
      this.lrclist = fun.lrcParser(this.lrc)
      this.lastIndex = this.lrclist.length - 1
    },
    activeIndex (val) {
      if (this.play === false) return
      fun.lrcContrl(this.$refs.box, this.$refs.lrc, 10, this.lastIndex + 1, this.activeIndex, true)
    },
    lrclist () {
      this.$nextTick(_ => {
        // 在歌词准备好后调整歌词位置，派发准备完毕事件
        this.$refs.box.scrollTop = 0
        eventBus.$emit('lrcReady')
      })
    }
  },
  computed: {
    activeIndex () {
      let last
      for (let item of this.lrclist) {
        if (item.time > this.currentTime) {
          return item.index - 1
        }
        last = item.index
      }
      return last
    }
  },
  methods: {
    pausedLrc () {
      fun.lrcContrl.stop()
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        fun.lrcContrl.open()
        delete this.timer
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
div{
  overflow: auto;
  height: 80vh;
  margin: 30px 0;
}
ul {
  text-align: center;
  li {
    height: 8vh;
    font-size: 17px;
  }
  li.active {
    color:rgb(139, 228, 56);
    font-size: 20px;
  }
}
</style>
