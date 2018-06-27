/* eslint-disable */
export default {
  data () {
    return {
      play: true,
      audio: null
    }
  },
  created () {
    const audio = this.audio = new Audio('http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF.mp3')
    if (this.play) {
      
        audio.play()
          .catch(e => {
            alert(e)
          })
      
    }
  },
  // methods: {
  //   changeState () {
  //     this.play = !this.play
  //     if (this.play) {
  //       this.audio.play()
  //     } else {
  //       this.audio.pause()
  //     }
  //   }
  // },
  watch : {
    'play' (val) {
      
    }
  },
  render () {
    return (
      <div >
        <button onClick={this.changeState}>bofang2</button>
      </div>
    )
  }
}
