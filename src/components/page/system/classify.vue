<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 分类配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>

            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="createTime" label="创建时间" :formatter="dealTime" ></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="typeName" label="分类名称"></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                      <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>

                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="30%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item required="" label="分类名称">
                   <el-input v-model="form.typeName" ></el-input>
                </el-form-item>
                <el-form-item required="" label="排序">
                    <el-input v-model="form.sort"  type="number"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
             </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'level',
        data() {
            return {
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    typeName:"",
                    sort:0,
                },
                idx: -1
            };
        },
        created() {
            this.getData();

        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                        this.$axios.post("/appraisalType/getAppraisalType").then(res => {
                        this.tableData = res.data;
                    });
            },

            add() {
                //添加
                this.editVisible = true;
                this.form = {
                    id: "",
                    typeName:"",
                    sort:0
                 };
            },

            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    typeName: item.typeName,
                    sort:item.sort,
                };
                this.editVisible=true;
            },
            handleDelete(index, row) {
                this.form = {
                    id:row.id,
                    apShow:'no'
                };
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/appraisalType/addAppraisalType", fd).then(res => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });
                } else {
                    //编辑
                    this.$axios.post("/appraisalType/updAppraisalType", fd).then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });
                }
            },
            // 确定删除
            deleteRow() {

                let fd = JSON.parse(JSON.stringify(this.form));
                this.$axios
                    .post("/appraisalType/updAppraisalType", fd)
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.getData();
                        this.$message.success("删除成功");
                        this.delVisible = false;
                    });
            },
        dealTime(row) {
            if (row.createTime != null) {
                var date1 = new Date(row.createTime.time);
                return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()+" "+date1.getHours()+":"+date1.getMinutes()+":"+date1.getSeconds();
            }else{
                return '';
            }
        },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
</style>
