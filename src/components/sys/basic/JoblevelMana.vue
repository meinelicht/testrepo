<template>
  <div>
    <div>
      <el-input
        size="small"
        style="width: 300px; margin-right: 8px"
        placeholder="添加职称名称..."
        suffix-icon="el-icon-plus"
        @keydown.enter.native="addPosition"
        v-model="jl.name"
      >
      </el-input>
      <el-select
        size="small"
        v-model="jl.titleLevel"
        placeholder="职称等级"
        style="width: 200px; margin-right: 8px"
      >
        <el-option
          v-for="item in titleLevels"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button
        size="small"
        icon="el-icon-plus"
        type="primary"
        plain
        @click="addJobLevel"
        >添加</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="jls"
        size="small"
        stripe
        border
        style="width: 80%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职称名称" width="150">
        </el-table-column>
        <el-table-column prop="titleLevel" label="职称等级" width="150">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="150">
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteHandler(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button
        type="danger"
        size="small"
        style="margin-top: 8px"
        :disabled="this.multipleSelection.length == 0"
        @click="deleteMany"
        >批量删除</el-button
      >
    </div>
    <el-dialog title="编辑职称" :visible.sync="dialogVisible" width="30%">
      <table>
          <tr>
              <td><el-tag>职称名称</el-tag></td>
              <td><el-input v-model="updateJl.name" size="small" style="margin-left:6px; width:200px"></el-input></td>
          </tr>
          <div style="margin: 2px 0;"></div>
          <tr>
              <td><el-tag>职称等级</el-tag></td>
              <td>
                <el-select
                    size="small"
                    v-model="updateJl.titleLevel"
                    placeholder="职称等级"
                    style="width: 200px; margin-left: 6px"
                >
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item"
                >
        </el-option>
      </el-select>
              </td>
          </tr>
          <div style="margin: 2px 0;"></div>
          <tr>
              <td><el-tag>是否启用</el-tag></td>
              <td><el-switch
                    v-model="updateJl.enabled"
                    active-text="已启用"
                    inactive-text="未启用"
                    style="margin-left:6px;"
                    >
                    </el-switch>
              </td>
          </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doUpdate" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JoblevelMana",

  data() {
    return {
      jl: {
        name: "",
        titleLevel: "",
      },
      titleLevels: ["正高级", "副高级", "中级", "初级", "员级"],
      jls: [],
      multipleSelection: [],
      dialogVisible: false,
      updateJl: {
        name: "",
        titleLevel: "",
        enabled: false
      },
    };
  },

  mounted() {
    this.initJls();
  },

  methods: {
    initJls() {
      this.getRequest("/system/basic/joblevel/").then((resp) => {
        if (resp) {
          this.jls = resp;
          this.jl.name = "";
          this.jl.titleLevel = "";
        }
      });
    },
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest("/system/basic/joblevel/", this.jl).then((resp) => {
          if (resp) {
            this.$message({
              message: "添加成功！",
              type: "success",
            });
            this.initJls();
          }
        });
      } else {
        this.$message.error("字段不能为空！");
      }
    },
    deleteHandler(data) {
      this.$confirm("此操作将永久删除[" + data.name + "]职称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRequest("/system/basic/joblevel/" + data.id).then(
            (resp) => {
              if (resp) {
                this.initJls();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteMany() {
      this.$confirm(
        "此操作将永久删除[" + this.multipleSelection.length + "]条职称",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids = "?";
          this.multipleSelection.forEach((item) => {
            ids += "ids=" + item.id + "&";
          });
          this.deleteRequest("/system/basic/joblevel/" + ids).then((resp) => {
            if (resp) {
              this.initJls();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    doUpdate() {
        this.putRequest("/system/basic/joblevel/", this.updateJl).then((resp) => {
        if (resp) {
          this.initJls();
          this.dialogVisible = false;
        }
      });
    },
    showEditView(data) {
    //展示数据不要直接赋值，用拷贝操作，否则v-model绑定需要刷新才会显示更新结果
      Object.assign(this.updateJl, data);
      this.updateJl.createDate = "";
      this.dialogVisible = true;
    },
  },
};
</script>