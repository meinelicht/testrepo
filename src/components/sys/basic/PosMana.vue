<template>
  <div>
    <div>
      <el-input
        size="small"
        class="addPosInput"
        placeholder="添加职位..."
        suffix-icon="el-icon-plus"
        @keydown.enter.native="addPosition"
        v-model="pos.name"
      >
      </el-input>
      <el-button
        size="small"
        icon="el-icon-plus"
        type="primary"
        plain
        @click="addPosition"
        >添加</el-button
      >
    </div>
    <div class="posManaMain">
      <el-table
        :data="positions"
        size="small"
        stripe
        border
        style="width: 70%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"> </el-table-column>
        <el-table-column prop="name" label="职位" width="120">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200">
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showEditView(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
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
    <el-dialog title="编辑职位" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input
          v-model="updatePos.name"
          class="updatePosInput"
          size="small"
        ></el-input>
      </div>
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
  name: "PosMana",
  data() {
    return {
      pos: {
        name: "",
      },
      positions: [],
      dialogVisible: false,
      updatePos: {
        name: "",
      },
      multipleSelection: [],
    };
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    addPosition() {
      if (this.pos.name) {
        this.postRequest("/system/basic/pos/", this.pos).then((resp) => {
          if (resp) {
            this.$message({
              message: "添加成功！",
              type: "success",
            });
            this.initPositions();
            this.pos.name = "";
          }
        });
      } else {
        this.$message.error("职位名称不能为空！");
      }
    },
    showEditView(index, data) {
      //展示数据不要直接赋值，用拷贝操作，否则v-model绑定需要刷新才会显示更新结果
      Object.assign(this.updatePos, data);
      this.updatePos.createDate = "";
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      //Delete may have some risks, should be comfirmed by user
      this.$confirm("此操作将永久删除[" + data.name + "]职位", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRequest("/system/basic/pos/" + data.id).then((resp) => {
            if (resp) {
              this.initPositions();
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
    initPositions() {
      this.getRequest("/system/basic/pos/").then((resp) => {
        if (resp) {
          this.positions = resp;
        }
      });
    },
    doUpdate() {
      this.putRequest("/system/basic/pos/", this.updatePos).then((resp) => {
        if (resp) {
          this.initPositions();
          this.dialogVisible = false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteMany() {
        this.$confirm("此操作将永久删除[" + this.multipleSelection.length + "]条职位", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids='?'
          this.multipleSelection.forEach(item=>{
              ids+= 'ids='+item.id+'&'
          })
          this.deleteRequest("/system/basic/pos/"+ids).then((resp) => {
            if (resp) {
              this.initPositions();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    }
  },
};
</script>

<style>
.addPosInput {
  width: 300px;
  margin-right: 8px;
}
.posManaMain {
  margin-top: 10px;
}
.updatePosInput {
  width: 200px;
  margin-left: 8px;
}
</style>