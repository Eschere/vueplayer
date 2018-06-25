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
  let step
  if (Math.abs(to - from) > 500) step = 20
  else if (Math.abs(to - from) > 1000) step = 40
  else step = 2

  if (from < to) {
    if (linearScroll.timer) clearInterval(linearScroll.timer)
    linearScroll.timer = setInterval(() => {
      dom.scrollTop += step
      if (dom.scrollTop >= to) {
        clearInterval(linearScroll.timer)
        linearScroll.timer = null
      }
    }, 20)
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

export default {
  formatTime,
  strToTime,
  lrcParser,
  linearScroll
}
