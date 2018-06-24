export default {
  formatTime (time) {
    let s = Math.floor(time % 60)
    let m = Math.floor(time / 60)
    s = s < 10 ? '0' + s : s
    m = m < 10 ? '0' + m : m
    return m + ':' + s
  }
}
