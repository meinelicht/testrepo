import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

//倒入font-awesome的CSS样式
import 'font-awesome/css/font-awesome.css'

// 用插件的方式实现函数的全局引用（在单 独的页面上用this.postRequest使用），就可以不用在每一个页面上分别引用了
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from './utils/menus'

Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

//给全局的组件设置样式，如果在组件中单独设置，则局部优先级大于全局优先级
Vue.use(ElementUI,{size:'small'})

Vue.config.productionTip = false

//全局前置守卫，每一次路由跳转之前，都要经过全局前置守卫，类似拦截器or过滤器的作用

router.beforeEach((to,from,next) => {
  //判断用户是否登录，登录才进行菜单初始化的操作
  //在Login中定义了用户登录后，sessionstorage中会有用户的token，通过此字段进行判断
  if(window.sessionStorage.getItem('tokenStr')){
    initMenu(router,store)
    if(!window.sessionStorage.getItem('user')){
      //判断用户信息是否存在,如果不存在，返回用户信息
      return getRequest('/admin/info').then(resp=>{
        if(resp){
          //存入用户信息
          window.sessionStorage.setItem('user',JSON.stringify(resp));
          next();
        }
      })
    }
    //如果没有next函数，路由是不会自动跳转的，有放行的意思
    next()//钩子
    //next() 是放行，但是如果next()里有参数的话，next()就像被重载一样，就有了不同的功能
  }else {
    //如果是未登录状态，需要跳转到用户登录页
    if(to.path=='/'){
      next();
    }else{
      //菜单重定向
      next('/?redirect='+to.path);
    }
    
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
