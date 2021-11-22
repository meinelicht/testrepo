import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

//若有两个<router-view/>，默认跳转到APP的router-view，无法实现跳转页面显示在Home的页面中，所以需要添加子路由
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
    //hidden标签表示在配置动态路由的时候防止该路径被循环到
  },
]

const router = new VueRouter({
  routes
})

export default router
