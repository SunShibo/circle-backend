<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 地区设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="add">添加</el-button>
      </div>
        <el-tree :data="tableData" :props="defaultProps" :render-content="renderContent" ></el-tree>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="新增/编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="closeOnClickModal">
      <el-form ref="form" :model="form"  label-width="50px">
        <el-form-item label-width="100px" label="名称" prop="name" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"  :loading="$store.state.requestLoading"  @click="saveEdit('form')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'region',
    data() {
      return {
        editVisible:false,
          tableData: [],
          defaultProps: {
              children: 'chinaRegionBOList',
              label: 'name',
          },
          form:{
            name:'',
            pid:'',
            id:''
          }
      };
    },
    created() {
      this.getData();
    },
    computed: {
      data() {
        return this.tableData;
      },
    },
    methods: {
      // 获取 easy-mock 的模拟数据
      getData() {
        // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
        this.$axios.post("/ChinaRegionController/getChinaRegionBOList", {
        }).then(res => {
          this.tableData = res.data;
        });
      },
      search() {
        this.getData();
      },
      add() {
        //添加
        this.editVisible = true;
        this.form.id='';
        this.form.pid='0';
        this.form.name='';
      },
      //添加 或者 编辑
      saveEdit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let fd = JSON.parse(JSON.stringify(this.form));
              if(fd.id==null || fd.id==''){
                delete fd.id;
                this.$axios.post("/ChinaRegionController/addChinaRegionBO", fd).then(res => {
                  if (!res.success) {
                    this.$message.success(res.errMsg);
                    return;
                  }
                  this.$message.success(`操作成功`);
                  this.getData();
                  this.editVisible = false;
                });
               }else{
                this.$axios.post("/ChinaRegionController/updChinaRegion", fd).then(res => {
                  if (!res.success) {
                    this.$message.success(res.errMsg);
                    return;
                  }
                  this.$message.success(`操作成功`);
                  this.getData();
                  this.editVisible = false;
                });
              }

          } else {
            console.error("error submit!!");
            return false;
          }
        });
      },
      renderContent(h, { node, data, store }) {
          let pid = data.pid;
        return ( <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                <span>{node.label}</span>
                </span>
                <span style="display: flex; align-items: center;">
                {pid ? '' : <el-button type="text" on-click={(e) => this.append(node, data, e)}>添加</el-button>}
              <el-button size="mini" type="text" on-click={(e) => this.upRegion(node, data, e)}>编辑</el-button>
              <el-button size="mini" type="text" on-click={(e) => this.remove(node, data, e)}>删除</el-button>
                </span>
        </span>)
      },
        append(node,data,e) {
          e.stopPropagation();
          this.editVisible=true;
          this.form.pid=data.id;
          this.form.name='';
          this.form.id='';
        },
        upRegion(node,data,e){
          e.stopPropagation();
          this.editVisible=true;
          this.form.pid=data.id;
          this.form.name=data.name;
          this.form.id=data.id;
        },
        remove(node, data,e){
          e.stopPropagation();
          let str='';

          if(data.pid=='0'){
            str='删除下面所有地区'
          }else{
            str='删除该地区';
          }
          this.$confirm('此操作将' + str + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios({
              url: '/ChinaRegionController/delChinaRegion',
              method: 'POST',
              data: {
                id: data.id,
              },
            }).then(res => {
              if (res) {
                this.$message.success("操作成功");
                this.getData();
              }
            });
          })


        }
    }
  };
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

</style>
