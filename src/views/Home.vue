<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>
      <el-dropdown class="userInfo" @command="commandHandler">
        <span class="el-dropdown-link">
          {{user.name}}<img src="https://images.unsplash.com/photo-1637013296898-107ddb607a5e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 在el-meun中增加菜单点击事件，实现点击菜单自动跳转到子页面 -->
          <!-- <el-menu @select="meunClick"> -->

          <!-- 启用Vue router模式 -->
          <!-- 模式启用后，会以index作为路径进行路由跳转 -->
          <!-- unique-opened 不会多选打开 -->
          <el-menu router unique-opened>
            <!-- 通过添加v-for循环，把子目录的index循环出来 -->
            <!-- V-bind:key 为了在for循环中给vue一个提示，以便跟踪每个节点的身份 -->
            <!-- 子菜单index需与获取到的index一致，并变为字符串类型，若=1代表默认是一个子菜单 -->
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in routes"
              :key="index"
              v-if="!item.hidden"
            >
              <!-- //<i>标签表示图标 -->
              <template slot="title">
                <i
                  :class="item.iconCls"
                  style="color: #1accff; margin-right: 5px"
                ></i>
                <span>{{ item.name }}</span>
              </template>

              <!-- index索引 定义路由跳转位置 -->
              <el-menu-item
                :index="children.path"
                v-for="(children, indexj) in item.children"
                :key="indexj"
              >
                <span>{{ children.name }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
            <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到云E办系统！
            </div>
          <!-- router-view埋在所在页面路径的上一级模板中 e.g. 此标签埋在Home.vue中，访问链接为/home/test1 和/home/test2 -->
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      //JSON.parse函数，将字符串转换成对象
      user: JSON.parse(window.sessionStorage.getItem("user")),
    };
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
  methods: {
    commandHandler(command) {
      if(command=='logout'){
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录
          this.postRequest('/logout');
          //清空sessionstorage
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          //清空vuex中存储的菜单信息
          this.$store.commit('initRoutes',[]);
          //路由跳转到Login界面
          this.$router.replace('/')
          this.$message({
            type: 'success',
            message: '注销成功！'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      }
    }
  }
};
</script>

<style scoped>
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  /* 去掉空格 */
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: "Times New Roman", Times, serif;
  color: white;
}

.homeHeader .userInfo{
  cursor: pointer
}
.el-dropdown-link img{
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}
.homeWelcome{
  text-align: center;
  font-size: 30px;
  font-family: "Times New Roman", Times, serif;
  color: #409eff;
  padding-top: 50px;
}
.homeRouterView{
  margin-top:10px;
}
</style>
