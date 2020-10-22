import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './style/base.less'
import './style/iconfont.css'
import 'lib-flexible'
import axios from 'axios'
import _ from 'lodash'
import HmHeader from './component/HmHeader.vue'
import HmLogo from './component/HmLogo.vue'
import HmButton from './component/HmButton.vue'
import HmPost from './component/HmPost.vue'
import HmComment from './component/HmComment.vue'
import HmFloor from './component/HmFloor.vue'
import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Sticky,
  Icon
} from 'vant'

Vue.use(Icon)
Vue.use(Sticky)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(Uploader)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(PullRefresh)

Vue.prototype.$_ = _
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:3000'

import moment from 'moment'
Vue.filter('date', (res, format = 'YYYY-MM-DD HH:mm') => {
  return moment(res).format(format)
})


Vue.component('hm-floor', HmFloor)
Vue.component('hm-post', HmPost)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-header', HmHeader)
Vue.component('hm-comment', HmComment)


axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// axios.interceptors.response.use(res => {
//   const {
//     statusCode,
//     message
//   } = res.data
//   if (statusCode === 401 && message == '用户信息验证失败') {

//     //1. 跳转到 login 页
//     router.push('/login')

//     //2. 移除
//     localStorage.removeItem('token')
//     localStorage.removeItem('user_id')

//     //3. 提示
//     Toast.fail('token失效')
//   }

//   return res
// })

const bus = new Vue()
Vue.prototype.$bus = bus



new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')