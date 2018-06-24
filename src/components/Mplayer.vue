<template>
  <div style="display:none">
    player use audio-api
  </div>
</template>
<script>
import eventBus from '@/eventBus.js'

export default {
  data () {
    return {
      audio: null,
      loopType: '',
      volume: 0.5
    }
  },
  props: [
    'src',
    'play'
  ],
  mounted () {
    const audio = this.audio = new Audio(this.src)
    if (this.play) {
      audio.play()
        .catch(() => {
          eventBus.$emit('changeState', false)
        })
    }
    audio.volume = this.volume
    audio.oncanplay = () => {
      eventBus.$emit('duration', audio.duration)
      eventBus.$emit('volume', this.volume)
    }
    audio.ontimeupdate = function () {
      eventBus.$emit('currentTime', audio.currentTime)
    }

    audio.onended = () => {
      if (this.loopType === 'single-circle') audio.play()
      else eventBus.$emit('ended')
    }
  },
  watch: {
    'src' () {
      this.audio.src = this.src
      if (this.play) {
        this.audio.play()
      }
    },
    'volume' (val) {
      this.audio.volume = val
    },
    'play' (val) {
      val ? this.audio.play() : this.audio.pause()
    }
  },
  created () {
    eventBus.$on('AppMeta', ({loopType}) => {
      this.loopType = loopType
    })
    eventBus.$on('changeVolume', e => {
      this.volume = e
    })
    eventBus.$on('changeCurrentTime', e => {
      this.audio.currentTime = e
    })
    eventBus.$on('changeLoop', e => {
      this.loopType = e
    })
  }
}
</script>
