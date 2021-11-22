import router from "../router";
import {getRequest} from "./api"

export const initMenu = (router,store)=>{
    if(store.state.routes.length>0){
        return;
    }
    getRequest('/system/menu').then(data=>{
        if(data){
            //fmtRoutes是格式化好的routers
            let fmtRoutes = formatRoutes(data);
            //添加到路由
            router.addRoutes(fmtRoutes)
            //数据存入store中
            store.commit('initRoutes',fmtRoutes)
        }
    })
}

//格式化从后端取来的路由数据
export const formatRoutes = (routes)=>{
    let fmtRoutes = [];
    routes.forEach(router=>{
        let{
            path,
            component,
            name,
            iconCls,
            children,
        } = router;
        //处理children节点
        if(children && children instanceof Array){
            //递归
            children = formatRoutes(children);
        }
        //对component进行单独格式化(从后端接口传过来的数据格式为string)
        let fmRouter = {
            path:path,
            name:name,
            iconCls:iconCls,
            children:children,
            component(resolve){
                //以包的名字为判断基础，实现动态路由
                if(component.startsWith('Home'))
                {
                    require(['../views/'+component+'.vue'],resolve)
                }else 
                if(component.startsWith('Emp'))
                {
                    //require函数,实现路由的懒加载（不和首页一起渲染）
                    require(['../views/emp/'+component+'.vue'],resolve)
                }else if(component.startsWith('Per'))
                {
                    //require函数,实现路由的懒加载（不和首页一起渲染）
                    require(['../views/per/'+component+'.vue'],resolve)
                }else if(component.startsWith('Sal'))
                {
                    //require函数,实现路由的懒加载（不和首页一起渲染）
                    require(['../views/sal/'+component+'.vue'],resolve)
                }else if(component.startsWith('Sta'))
                {
                    //require函数,实现路由的懒加载（不和首页一起渲染）
                    require(['../views/sta/'+component+'.vue'],resolve)
                }else if(component.startsWith('Sys'))
                {
                    //require函数,实现路由的懒加载（不和首页一起渲染）
                    require(['../views/sys/'+component+'.vue'],resolve)
                }
                
            }
        }
        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes;
}