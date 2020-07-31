<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 二级分类
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                分类:
                <el-select v-model="search.typeId" placeholder="状态" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.id"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="_search">搜索</el-button>
                <el-button type="primary" icon="search" @click="addHandler">新增</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column
                        :formatter="dealTimeStartTime"
                        prop="createTime"
                        label="创建时间"
                        width="200px"
                >
                </el-table-column>
                <el-table-column
                        :formatter="dealTimeUpdTime"
                        prop="updateTime"
                        label="修改时间"
                        width="200px"
                >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="name"
                                 label="名称"
                >
                </el-table-column>
                <el-table-column
                        :formatter="typeShow"
                        :show-overflow-tooltip="true"
                        prop="typeId"
                        label="主分类">
                </el-table-column>
                <el-table-column
                        prop="sort"
                        label="排序">
                </el-table-column>
                <el-table-column label="图标" prop="url" width="80">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.$index, scope.row)" type="text">编辑</el-button>
                        <el-button @click="delClick(scope.$index, scope.row)" type="text" class="del10">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <!--编辑-->
        <el-dialog title="新增/编辑" :visible.sync="editVisible"  width="70%"  :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="分类" prop="typeId"
                                      :rules="[{required: true, message: '请选择', trigger: 'blur'}]">
                            <el-select v-model="form.typeId">
                                <el-option
                                        v-for="item in types"
                                        :key="item.id"
                                        :label="item.typeName"
                                        :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称" prop="name"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'blur'}]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="排序">
                            <el-input type="number" v-model="form.sort"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                    <el-form-item  required="" label="图标">
                        <UpLoad
                                idName="videoImg"
                                :onUpLoadSuccess="pictureUrlSuccess"
                                :onUpLoadRemove="handleRemoveThumbnailImageUrl"
                                :onUpLoadError="onUpLoadError"
                                :multiple="false"
                                :drag="true"
                                accept="image/*"
                                :fileList="pictureUrl"
                                refUpLoad="videoImageUploadUrl"
                                listType="picture"></UpLoad>
                    </el-form-item>

                  </el-col>
                </el-row>
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
    import UpLoad from '../../common/Upload.vue';
    export default {
        name: 'typeInfo',
        components: {UpLoad},
        data() {
            return {
                pictureUrl:[],
                editVisible: false,
                delVisible: false,
                tableData: [],
                search: {
                    typeId: '',
                },
                types: [],
                editVisible: false,
                idx: -1,
                form: {
                    id: '',
                    name: '',
                    typeId: '',
                    sort: '',
                    apShow: '',
                    pictureUrl:'',
                },

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
            typeShow(row) {
                for (let i = 0; i < this.types.length; i++) {
                    if (row.typeId == this.types[i].id) {
                        return this.types[i].typeName;
                    }
                }
                return "";
            },
            dealTimeStartTime(row) {
                return this.formTime(row.createTime)
            },
            dealTimeUpdTime(row) {
                return this.formTime(row.updateTime)
            },
            formTime(time) {
                if (time != null) {
                    var date1 = new Date(time.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/appraisalType/queryTypeInfo", {
                        typeId: this.search.typeId
                    })
                    .then(res => {
                        this.tableData = res.data;
                    });

                this.$axios
                    .post("/appraisalType/getAppraisalType")
                    .then(res => {
                        this.types = res.data;
                    });
            },
            _search() {
                this.getData();
            },
            // 编辑
            handleClick(idex, row) {
                this.editVisible = true;
                if(!!row.pictureUrl){
                    this.pictureUrl=[{name:row.pictureUrl,url:row.pictureUrl}];//缩略图
                }

                this.form = {
                    id: row.id,
                    name: row.name,
                    typeId: row.typeId,
                    sort: row.sort,
                    pictureUrl:row.pictureUrl
                }
            },
            //添加
            addHandler() {
                this.editVisible = true;
                this.pictureUrl=[];
                this.form = {
                    id: '',
                    name: '',
                    typeId: '',
                    sort: 0,
                    pictureUrl:'',
                }
            },
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fd = JSON.parse(JSON.stringify(this.form));
                        if (this.form.pictureUrl == '' || this.pictureUrl == null) {
                            this.$message.error("图标必须上传");
                            return;
                        }
                            if (this.form.id == '' || this.form == null) {
                            this.$axios.post("/appraisalType/addTypeInfo", fd).then(res => {
                                if (!res.success) {
                                    this.$message.success(res.errMsg);
                                    return;
                                }
                                this.$message.success(`操作成功`);
                                this.getData();
                                this.editVisible = false;
                            });
                        } else {
                            this.$axios.post("/appraisalType/updTypeInfo", fd).then(res => {
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
            //点击删除
            delClick(idex, row) {
                this.delVisible = true;
                this.form = {
                    id: row.id,
                    name: row.name,
                    typeId: row.typeId,
                    sort: row.sort,
                    apShow: 'no'
                }
            },
            //确认删除
            deleteRow() {
                let fd = JSON.parse(JSON.stringify(this.form));
                this.$axios.post("/appraisalType/updTypeInfo", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.delVisible = false;
                });
            },
            pictureUrlSuccess(res, file) {
                console.log(res)
                this.$message.success('上传成功！');
                this.form.pictureUrl=res;
            },
            handleRemoveThumbnailImageUrl(file) {
                this.form.pictureUrl='';
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

    .handle-input {
        width: 100px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .del10 {
        color: red;
    }
</style>