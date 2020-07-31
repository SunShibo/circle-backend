<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 认证案例
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                <el-table-column label="示例图" prop="url">
                    <template slot-scope="scope">
                        <img :src="scope.row.demoPicture" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" :formatter="dealTime"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
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

        <el-dialog title="新增" :visible.sync="addVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item required="" label="缩略图">
                    <UpLoad
                            idName="videoImg"
                            :onUpLoadSuccess="pictureUrlSuccess"
                            :onUpLoadRemove="handleRemoveThumbnailImageUrl"
                            :onUpLoadError="onUpLoadError"
                            :multiple="false"
                            :drag="true"
                            accept="image/*"
                            :fileList="demoPicture"
                            refUpLoad="videoImageUploadUrl"
                            listType="picture"></UpLoad>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
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
    import UpLoad from '../../common/Upload.vue';

    export default {
        name: 'case',
        components: {UpLoad},
        data() {
            return {
                demoPicture: [],
                tableData: [],
                delVisible: false,
                addVisible:false,
                form: {
                    id: '',
                    demoPicture: '',
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
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            dealTimeend(row) {
                if (row.updateTime != null) {
                    var date1 = new Date(row.updateTime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/UserCertificationDemo/getCertificationDemoList")
                    .then(res => {
                        this.tableData = res.data;
                    });
            },
            add() {
                //添加
                this.demoPicture=[],
                this.addVisible = true;
                this.form = {
                    id: '',
                    demoPicture: '',
                };
            },

            handleDelete(index, row) {
                this.form = {
                    id: row.id,
                    interestName: row.interestName,
                    typeId: row.typeId
                };
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fd = JSON.parse(JSON.stringify(this.form));
                        this.$axios.post("/UserCertificationDemo/addCertificationDemo", fd).then(res => {
                            if (!res.success) {
                                this.$message.success(res.errMsg);
                                return;
                            }
                            this.$message.success(`操作成功`);
                            this.getData();
                            this.addVisible = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            // 确定删除
            deleteRow() {
                this.$axios
                    .post("/UserCertificationDemo/delCertificationDemo", {demoId: this.form.id})
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
            pictureUrlSuccess(res, file) {
                this.$message.success('上传成功！');
                this.form.demoPicture=res;
            },
            handleRemoveThumbnailImageUrl(file) {
                this.form.demoPicture='';
            },
            onUpLoadError(err){
                console.error(err);
                this.$message.error('上传失败，请重新上传！');
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
