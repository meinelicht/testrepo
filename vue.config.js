//处理验证码跨域加载问题,通过nodeJS搞代理,从8080端口转发到8081去

//新建代理类
let proxyObj={

}

//所有为/的路径都要去代理
proxyObj['/']={
  //websocket代理，与普通代理不同，特意定义
  ws:false,
  //代理到哪里去
  target:'http://localhost:8081',
  //changeOrigin表示发送请求对象的时候，请求头中的host会被我们设置成target中的内容
  changeOrigin:true,
  //不要去重写请求地址
  pathReWrite:{
    '^/':'/'
  }
}



//配置需要访问的默认路径端口是哪里
module.exports={
  //开发
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  }
}