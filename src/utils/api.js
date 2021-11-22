import axios from 'axios'
import router from '../router'//会自动去找index.js

//由于message组件只能在vue文件中被直接使用，而不能被js文件自动引用，所以在此手动单独引用，详见官方文档
import { Message } from 'element-ui';

//写axios拦截器,有两种 response和request

//请求拦截器
axios.interceptors.request.use(
  config =>{
    //判断sessionStorage中的用户token是否存在,如果存在token，请求携带token
    //后端会有专门的token拦截器，如果有token并且验证通过，说明登陆成功过了，后面的接口就允许访问了，如果不存在就过不了登录拦截器
    if(window.sessionStorage.getItem('tokenStr')){
      //修改请求头配置
      config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
    }
    return config;
  }, error => {
    console.log(error);
  }
)



//响应拦截器作用：碰到请求失败的时候进行统一的处理
//success表示你成功的调到了后端的“接口”,如果成功了response响应码为200，但是后端逻辑处理也会有一个响应码
//(接上)比如要删除某一个部门，但是这个部门不允许被删除，因为底下还有子部门，后端会给出一个返回的代码（代表业务逻辑处理结果，注意与后端接口区分）与信息提示。后端返回的代码会提示业务逻辑是错误的，要去做对应的判断
axios.interceptors.response.use(
  success => {
  //成功调用到后端接口，但是业务逻辑错误(success.data.code)，不允许做该操作
  if(success.status&& success.status == 200)//success.status代表正常response中得到的响应码{
    if(success.data.code==500||success.data.code==401||success.data.code==403){//success.data代表后端返回的json对象，包含code、message、object。401未登录；403权限禁止
    {
      //弹出错误的消息提示框Message.error
      Message.error({message:success.data.message});
      return;//业务逻辑错误直接返回空，不需要反馈数据
    }
    if(success.data.message){
      Message.error({message:success.data.message})
    }
  }
  return success.data;
  }, 
  error => {
    //此部分代表后端接口调用错误(error.response.code 没有拿到json对象 直接是code)
    if(error.response.code==504||error.response.code==404){
      Message.error({message:'服务器被吃了o(╯□╰)o'})
    }else if(error.response==403){
      Message.error({message:'权限不足，请联系管理员'});
    }else if (error.response.code==401){
      Message.error({message:'尚未登录，请登录'});//没登录需要跳转到登录页，登录路由已经写好了
      router.replace('/')
    }else{
      if(error.response.data.message){
        Message.error({message:error.response.data.message});
      }else{
        Message.error({message:'未知错误'})
      }
    }
    return;
  })



//配置前置路径
let base = '';

//写封装请求！！(post/put/get/delete)
//传送Json格式的post 请求：包含一个url和一个参数)
export const postRequest = (url,params)=>{
  return axios({
    method:'post',
    //在大型项目中，在IP地址端口号和请求路径之间，加一个前置路径，去区分
    url:`${base}${url}`,
    data:params
  })
}

//传送Json的put请求
export const putRequest = (url,params)=>{
  return axios({
    method:'put',
    url:`${base}${url}`,
    data:params
  })
}

//传送Json的get请求
export const getRequest = (url,params)=>{
  return axios({
    method:'get',
    //在大型项目中，在IP地址端口号和请求路径之间，加一个前置路径，去区分
    url:`${base}${url}`,
    data:params
  })
}

//传送Json的delete请求
export const deleteRequest = (url,params)=>{
  return axios({
    method:'delete',
    //在大型项目中，在IP地址端口号和请求路径之间，加一个前置路径，去区分
    url:`${base}${url}`,
    data:params
  })
}