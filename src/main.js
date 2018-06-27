// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import App from './app2.jsx'
// import router from './router'

// 自适应
const width = window.innerWidth || document.documentElement.clientWidth
const html = document.documentElement || document.querySelector('html')
html.style.fontSize = width / 3.75 + 'px'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
