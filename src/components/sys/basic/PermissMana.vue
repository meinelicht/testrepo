<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        size="small"
        placeholder="请输入角色中文名"
        v-model="role.nameZh"
      >
      </el-input>
      <el-button type="primary" size="small" icon="el-icon-plus"
        >添加角色</el-button
      >
    </div>
    <div class="permissManaMain">
      <el-collapse accordion @change="change">
        <el-collapse-item
          :title="r.nameZh"
          :name="r.id"
          v-for="(r, index) in roles"
          :key="index"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button
                style="float: right; padding: 3px 0; color: red"
                type="text"
                icon="el-icon-delete"
                >删除角色</el-button
              >
            </div>
            <div>
              <el-tree
                show-checkbox
                :data="allMeuns"
                :props="defaultProps"
                node-key="id"
                :default-checked-keys="selectedMeuns"
              ></el-tree>
            </div>
            <div style="display:flex;justify-content: flex-end; margin-top:5px">
              <el-button size='mini'>取消修改</el-button>
              <el-button size='mini' type="primary">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",

  data() {
    return {
      role: {
        name: "",
        nameZh: "",
      },
      roles: [],
      allMeuns: [],
      //Card组件属性的别名
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectedMeuns:[]
    };
  },

  mounted() {
    this.initRoles();
  },

  methods: {
    initRoles() {
      this.getRequest("/system/basic/permiss/").then((resp) => {
        if (resp) {
          this.roles = resp;
        }
      });
    },
    change(rid) {
      //回调参数为activeNames，即rid的值为：name的值 r.id
      if (rid) {
        this.initAllMeuns();
        this.initSelectedMeuns(rid);
      }
    },
    initAllMeuns() {
      this.getRequest("/system/basic/permiss/menus").then((resp) => {
        if (resp) {
          this.allMeuns = resp;
        }
      });
    },
    initSelectedMeuns(rid){
      this.getRequest('/system/basic/permiss/mid/'+rid).then(resp=>{
        if(resp){
          this.selectedMeuns=resp;
        }
      })
    }
  },
};
</script>

<style>
.permissManaTool {
  display: flex;
  justify-content: flex-start;
}
.permissManaTool .el-input {
  width: 300px;
  margin-right: 6px;
}
.permissManaMain {
  margin-top: 10px;
  width: 700px;
}
</style>