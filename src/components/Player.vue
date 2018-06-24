<template>
<div class="player">
  <div class="play-pannel">
    <div class="head-info">
      <div>歌曲名：{{ title }}</div>
      <div>歌手名：{{ artist }}</div>
    </div>
    <figure :class="play ? 'playing' : 'paused'">
      <img :src="cover">
    </figure>
    <div class="ctl-l1">
      <div class="time-stage">
        <span>{{ currentTimeStr }}</span>
        <span>{{ leftTimeStr }}</span>
      </div>
      <div
        class="progress-bar"
        @touchend.stop.capture="changeProgress"
        ref="progress"
      >
        <div
          class="progress"
          :style="{ width: currentTime / duration * 100 + '%' }"
        ></div>
      </div>
    </div>
    <div class="ctl-l2">
      <div class="volume-pannel">
        <div
          class="volume-icon"
          :class="{muted: this.volume < 0.1 }"
        >

        </div>
        <div
          class="volume-bar"
          ref="volume"
          @touchend="changeVolume"
        >
          <div
            class="volume"
            :style="{width: this.volume*100+'%'}"
          >
          </div>
        </div>
      </div>
      <div
        class="circle-icon"
        :class="loopType"
        @touchend="changeLoop"
      >
      </div>
    </div>
  </div>
  <div class="controls">
    <span
      class="prev"
      @touchend="prev"
    ></span>
    <span
      :class="play ? 'paused-icon' : 'play-icon'"
      @touchend="changeState"
    ></span>
    <span
      class="next"
      @touchend="next"
    ></span>
  </div>
</div>
</template>

<script>
import eventBus from '@/eventBus.js'
import fun from '@/common/common.fn.js'
const typeList = ['circle', 'single-circle', 'random']

export default {
  data () {
    return {
      typeIndex: 0,
      cover: '',
      currentTime: 0,
      duration: 0,
      play: false,
      volume: 0,
      title: '',
      artist: ''
    }
  },
  created () {
    eventBus.$on('AppMeta', ({
      currentSong,
      play
    }) => {
      this.cover = currentSong.cover
      this.play = play
      this.title = currentSong.title
      this.artist = currentSong.artist
    })

    eventBus.$on('duration', (e) => {
      this.duration = e
    })

    eventBus.$on('currentTime', (e) => {
      this.currentTime = e
    })

    eventBus.$on('volume', e => {
      this.volume = e
    })

    eventBus.$on('changeState', e => {
      this.play = e
    })
  },
  computed: {
    currentTimeStr () {
      return fun.formatTime(this.currentTime)
    },
    leftTimeStr () {
      return fun.formatTime(this.duration - this.currentTime)
    },
    loopType () {
      return typeList[this.typeIndex]
    }
  },
  methods: {
    changeProgress (e) {
      const totalWidth = this.$refs.progress.clientWidth

      let offset = e.changedTouches[0].clientX - e.target.offsetLeft

      if (offset > totalWidth) offset = totalWidth

      this.currentTime = this.duration * offset / totalWidth

      eventBus.$emit('changeCurrentTime', this.currentTime)
    },
    changeVolume (e) {
      const totalWidth = this.$refs.volume.clientWidth

      let offset = e.changedTouches[0].clientX - e.target.offsetLeft

      if (offset > totalWidth) offset = totalWidth

      this.volume = offset / totalWidth
      if (this.volume < 0.1) this.volume = 0

      eventBus.$emit('changeVolume', this.volume)
    },
    changeLoop (e) {
      this.typeIndex === typeList.length - 1 ? this.typeIndex = 0 : this.typeIndex++

      eventBus.$emit('changeLoop', typeList[this.typeIndex])
    },
    changeState () {
      this.play = !this.play
      eventBus.$emit('changeState', this.play)
    },
    prev () {
      eventBus.$emit('prev')
    },
    next () {
      eventBus.$emit('next')
    }
  }
}
</script>

<style>
.playing {
  animation-play-state: running !important;
}

.paused {
  animation-play-state: paused !important;
}

@keyframes circling {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>

<style lang="scss" scoped>
$base:100;
.player {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.play-pannel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: space-around;
  .head-info {
    text-align: center;
    & > div:first-child{
      font-size: 18px;
      margin-bottom: 10px;
    }
    & > div:last-child{
      font-size: 16px;
    }
  }
  figure {
    width: 185/$base + rem;
    height: 185/$base + rem;
    border-radius: 50%;
    overflow: hidden;
    animation: circling 20s linear infinite;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .ctl-l1,
  .ctl-l2 {
    width:80%;
  }
  .time-stage {
    display:flex;
    justify-content: space-between;
  }
  .progress-bar {
    width: 100%;
    height: 5px;
    background: #ccc;
    .progress {
      width: 0;
      height: 100%;
      background: #e02b2b;
    }
  }
  .ctl-l2 {
    display: flex;
    justify-content: space-between;
    .volume-pannel {
      display: flex;
      align-items: center;
      .volume-icon {
        width: 30px;
        height: 22px;
        background: url('./images/icons.png') no-repeat 0 -143.5px;
        margin-right: 10px;
      }
      .volume-icon.muted {
        background-position-y: -181.5px;
      }
    }
    .volume-bar {
      min-width: 50px;
      height: 5px;
      background: rgb(146, 192, 145);
      width: 80 / $base + rem;
      .volume {
        height: 100%;
        background: red;
        border-radius: 0 5px 5px 0;
      }
    }
    .circle-icon {
      width:30px;
      height: 22px;
      background: url('./images/icons.png') no-repeat 0;
    }
    .random {
      background-position-y: -73.5px;
    }
    .circle {
      background-position-y: -203.5px;
    }
    .single-circle {
      background-position-y: -230.5px;
    }
  }
}
.controls {
  width: 100vw;
  height: 50px;
  box-shadow: 0 0 5px rgba(0,0,0,0.6);
  display: flex;
  justify-content: space-around;
  align-items: center;
  span {
    background: url('./images/icons.png') no-repeat;
  }
  .prev {
    width: 20px;
    height: 20px;
    background-position: 0 -30px;
  }
  .play-icon {
    width: 40px;
    height: 40px;
    background-position: 0 0px;
    background-size: 132 * 40 / 30+px 1000 * 40 / 30+px;
  }
  .paused-icon {
    width: 40px;
    height: 40px;
    background-position: -40px 0px;
    background-size: 132 * 40 / 30+px 1000 * 40 / 30+px;
  }
  .next {
    width: 20px;
    height: 20px;
    background-position: 0 -50px;
  }
}
</style>
