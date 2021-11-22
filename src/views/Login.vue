<template>
  <div>
    <el-form
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :rules="rules"
      ref="loginForm"
      :model="loginForm"
      class="loginContainer"
    >
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          auto-complete="false"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          auto-complete="false"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          type="text"
          auto-complete="false"
          v-model="loginForm.code"
          placeholder="点击图片更换验证码"
          style="width: 250px; margin-right: 5px"
        ></el-input>
        <!--updataCaptcha方法处理 点击图片元素，重新生成验证码-->
        <img :src="captchaURL" @click="updateCaptcha" />
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录
        </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // captchaURL:'',
      //验证码后端接口地址，暂时停用
      captchaURL: "/captcha?time=" + new Date(),
      linkTest: "",
      loginForm: {
        username: "admin",
        password: "123",
        //验证码
        code: "",
      },
      // loginForm对应template里的model
      checked: true,
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      // rules对应template里el-form-item组件的prop属性
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", this.loginForm).then((resp) => {
            //resp为请求返回的对象，是Json格式，使用Json.stringify方法将resp转化为字符串
            if (resp) {
              this.loading = false;
              //获取token，并放在请求头中发送给后端（因为token不能直接在页面上显示）
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              //存储用户token到sessionStorage中（window关闭，该内存被清理）
              window.sessionStorage.setItem("tokenStr", tokenStr);
              //push和replace的区别:replace不可以通过回退按钮退回到之前的页面，push可以回退到之前的页面

              //页面跳转。跳到首页（如果没有重定向），如果有重定向，则用户登录后直接去重定向的页面
              let path = this.$route.query.redirect;
              this.$router.replace((path=='/'||path==undefined)?'/home':path);
            }
          });
        } else {
          this.$message.error("请输入所有字段！");
          return false;
        }
      });
    },
    //点击图片元素，重新生成验证码
    updateCaptcha() {
      this.captchaURL = "/captcha?time=" + new Date();
    },
  },
};
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px;
  background-color: antiquewhite;
  border: 1px solid brown;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

/* 验证码图片居中显示 */
.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>