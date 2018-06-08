// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
//import JsonExcel from 'vue-json-excel'

//Vue.component('downloadExcel',JsonExcel);

Vue.use(ElementUI)
Vue.config.productionTip = true


router.beforeEach((to, from, next) => {
	//In here, you can control every route before navigate to destination
	//Navigate to want user want to 
	next();
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  data(){
    return {
      //这里写全局变量，在子组件中用 this.$root.username 使用
      username: 'Qinluo',
    }
  },
  router,
  store,
  template: '<App/>',
  //template, A string template to be used as the markup for the Vue instance,
  //The template will <b>replace</b> the mounted element.
  components: { App }
})
