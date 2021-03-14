import Vue from 'vue'
import store from './store'
import App from './App'
import cuCustom from './components/cu-custom.vue'
import iconfont from './components/iconfont/iconfont.vue'
import iGlobal from './common/global.js'	//引入 global.js
import tui from './common/httpRequest'
import tabBar from './components/tabbar.vue'  
Vue.config.productionTip = false
// #ifdef H5
window.QQmap = null;
// #endif
// #ifndef MP-TOUTIAO
//网络监听
setTimeout(() => {
	uni.onNetworkStatusChange(function(res) {
		//console.log(res.networkType);
		store.commit("networkChange", {
			isConnected: res.isConnected
		})
	});
}, 100)
// #endif
Vue.prototype.tui = tui
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store

Vue.component('tab-bar', tabBar)
Vue.component('cu-custom',cuCustom) //全局导航组件
Vue.component('iconfont',iconfont) //全局图标组件
Vue.prototype.iGlobal=iGlobal	//将global.js挂载至Vue.prototype 实现全局调用
Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
