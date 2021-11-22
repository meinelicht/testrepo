import Vue from 'Vue'
import Vuex from 'Vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  //state是全局对象，用来保存所有组件的公共的数据
  state:{
    routes:[]
  },
  //改变state的方法(同步执行)
  mutations:{
    initRoutes(state,data){
      state.routes = data;
    }
  },
  //改变state的方法（异步执行）
  actions:{}
})