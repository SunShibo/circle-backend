<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 兴趣配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                兴趣分类：
                <el-select v-model="search.typeId" placeholder="全部" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="_search">搜索</el-button>
                <el-button type="primary" icon="add" @click="add">新增</el-button>
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="typeName" label="类型"></el-table-column>
                <el-table-column prop="interestName" label="名称"></el-table-column>
                <el-table-column label="创建时间" :formatter="dealTime"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="30%"  :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item prop="interestName"  label="名称" :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
                    <el-input v-model="form.interestName"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="typeId"  :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
                    <el-select v-model="form.typeId" >
                        <el-option
                                v-for="item in statusOption"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit('form')">确 定</el-button>
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
        name: 'interest',
        data() {
            return {
                search: {
                    typeId: ''
                },
                statusOption: [],
                tableData: [],
                editVisible: false,
                delVisible: false,
                form: {
                    id: '',
                    interestName: '',
                    typeId: '',
                },
                idx: -1
            };
        },
        created() {
            this.getData();

        },
        computed: {
            data() {
                return this.tableData;
            }
        },
        methods: {
            dealTime(row) {
                if (row.createTime != null) {
                    var date1 = new Date(row.createTime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                } else {
                    return '';
                }
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/interest/queryInterestType")
                    .then(res => {
                        this.statusOption = res.data;
                    });
                this.$axios
                    .post("/interest/queryInterestByTypeId", {
                        typeId: this.search.typeId
                    })
                    .then(res => {
                        this.tableData = res.data;
                    });
            },
            _search() {
                this.getData();
            },
            add() {
                //添加
                this.editVisible = true;
                this.form = {
                    id: '',
                    interestName: '',
                    typeId: '',
                };
            },

            handleEdit(index, row) {
                this.form = {
                    id: row.id,
                    interestName: row.interestName,
                    typeId:row.typeId
                };
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.form = {
                    id: row.id,
                    interestName: row.interestName,
                    typeId:row.typeId
                };
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fd = JSON.parse(JSON.stringify(this.form));
                        if (this.form.id == '' || this.form == null) {
                            this.$axios.post("/interest/addInterest", fd).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        } else {
                            this.$axios.post("/interest/updateInterest", fd).then(res => {
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
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/interest/delInterest", {id: this.form.id})
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
