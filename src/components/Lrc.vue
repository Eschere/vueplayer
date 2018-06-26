<template>
<div ref="box">
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

      // if (vm.play === false) return
      // if (vm.play === false) return
      // let height = vm.$refs.lrc.clientHeight
      // let box = vm.$refs.box
      // let offset = 0
      // if (vm.activeIndex > 4) {
      //   offset = (vm.activeIndex - 4) / (vm.lastIndex + 1) * height
      // }
      // if (vm.activeIndex > vm.lastIndex - 5) {
      //   offset = Math.floor((vm.lastIndex - 9) / (vm.lastIndex + 1) * height)
      // }
      // // fun.linearScroll(box, offset, box.scrollTop)
      // box.scrollTop = offset
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
      // let height = this.$refs.lrc.clientHeight
      // let box = this.$refs.box
      // let offset = 0
      // if (val > 4) {
      //   offset = (val - 4) / (this.lastIndex + 1) * height
      // }
      // if (val > this.lastIndex - 5) {
      //   offset = Math.floor((this.lastIndex - 9) / (this.lastIndex + 1) * height)
      // }
      // fun.linearScroll(box, offset, box.scrollTop)
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
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  text-align: center;
  // box-sizing: content-box;
  // padding: 20px 0;
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
