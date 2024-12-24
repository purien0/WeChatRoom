import Vue from 'vue'
import App from './App'
import io from './components/weapp.socket.io.js';



Vue.config.productionTip = false
Vue.prototype.socket = io('http://10.21.188.228:8082')//客户端访问的ip:port,设置为一个服务器端可使用的ip（如本机ip）,端口不被占用即可，与后端index.js中保持一致

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
