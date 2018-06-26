function formatTime (time) {
  let s = Math.floor(time % 60)
  let m = Math.floor(time / 60)
  s = s < 10 ? '0' + s : s
  m = m < 10 ? '0' + m : m
  return m + ':' + s
}

function strToTime (str) {
  // 00:00.00
  let time = str.split(':')
  return time[0] * 60 + (time[1] - 0)
}

function lrcParser (str) {
  let reg = /\[([0-9]+.*)\].*/g
  let arr = str.match(reg)
  arr = arr.map((item, index) => {
    let rest = new RegExp(/\[([0-9]+.*)\](.*)/).exec(item)
    return {
      index,
      time: strToTime(rest[1]),
      text: rest[2]
    }
  })
  return arr
}

function linearScroll (dom, to, from) {
  // 根据距离控制滚动速度
  let duration = 1000
  let distance = Math.abs(to - from)
  if (distance < 100) duration = 400
  let step = distance / duration * 20
  // 向下滚动
  if (from < to) {
    if (linearScroll.timer) clearInterval(linearScroll.timer)
    linearScroll.timer = setInterval(() => {
      dom.scrollTop += step
      if (dom.scrollTop >= to) {
        clearInterval(linearScroll.timer)
        linearScroll.timer = null
      }
    }, 20)
  // 向上滚动
  } else if (from > to) {
    if (linearScroll.timer) clearInterval(linearScroll.timer)
    linearScroll.timer = setInterval(() => {
      dom.scrollTop -= step
      if (dom.scrollTop <= to) {
        clearInterval(linearScroll.timer)
        linearScroll.timer = null
      }
    }, 20)
  }
}
linearScroll.stop = function () {
  clearInterval(this.timer)
  this.timer = null
}

/**
 * @param lrcBox 歌词外部容器（需要滚动的容器）
 * @param lrcContentDom 歌词内容容器
 * @param BoxLine 歌词显示行数
 * @param lrcLine 歌词总行数
 * @param currentIndex 当前歌词索引 从0开始
 * @param linear 是否渐变
 */
function lrcContrl (lrcBox, lrcContentDom, BoxLine, lrcLine, currentIndex, linear) {
  if (!lrcContrl.on) return
  let height = lrcContentDom.clientHeight
  let offset = 0
  let middle = Math.ceil(BoxLine / 2 - 1)
  if (currentIndex > middle) {
    offset = (currentIndex - middle) / lrcLine * height
  }
  if (currentIndex > lrcLine - 1 - (BoxLine - middle)) {
    offset = Math.floor((lrcLine - BoxLine) / (lrcLine) * height)
  }

  if (linear) linearScroll(lrcBox, offset, lrcBox.scrollTop)
  else lrcBox.scrollTop = offset
}

// 停止歌词控制
lrcContrl.stop = function () {
  this.on = false
  linearScroll.stop()
}
// 开启歌词控制
lrcContrl.open = function () {
  this.on = true
}

export default {
  formatTime,
  strToTime,
  lrcParser,
  linearScroll,
  lrcContrl
}
