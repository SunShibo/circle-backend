<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> app版本管理
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
                <el-table-column prop="id" label="版本id"></el-table-column>
                <el-table-column prop="title" label="更新标题" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="downurl" label="下载地址" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="platform" label="平台"  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="subcontent" label="更新内容" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="type" label="是否强制更新" :formatter="dealType"></el-table-column>
                <el-table-column prop="versioncode" label="版本号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="versionname" label="版本名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="创建时间" :formatter="dealTime"></el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">


                        <el-button
                                type="text"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="PageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>

            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="editVisible" width="70%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item required="" label="平台">
                            <el-select v-model="form.platform">
                                <el-option
                                        v-for="item in platformOption"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item required="" label="升级规则">
                            <el-select v-model="form.type">
                                <el-option
                                        v-for="item in typeOption"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item required="" label="更新标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="更新内容">
                            <el-input
                                    type="textarea"
                                    :autosize="{minRows: 2}"
                                    v-model="form.subcontent">
                            </el-input>
                        </el-form-item>

                        <el-form-item required="" label="版本号">
                            <el-input type="number" v-model="form.versioncode"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="版本名字">
                            <el-input v-model="form.versionname"></el-input>
                        </el-form-item>
                        <el-form-item required="" label="下载地址">
                            <el-input v-model="form.downurl" placeholder="安卓app不需要手动填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="app上传">
                            <UpLoad
                                    idName="handouts"
                                    :onUpLoadSuccess="handoutsSuccess"
                                    :onUpLoadRemove="handleRemoveHandouts"
                                    :onUpLoadError="onUpLoadError"
                                    :multiple="false"
                                    :drag="true"
                                    :randomName="false"
                                    :fileList="handoutsUrl"
                                    refUpLoad="handouts"
                                    listType="picture"></UpLoad>
                        </el-form-item>
                    </el-col>
                </el-row>
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
    import UpLoad from '../../common/Upload.vue';
    export default {
        name: 'version',
        components: {UpLoad},
        data() {
            return {
                showOverflowTooltip:true,
                // 总数据
                tableData:[],
                // 默认显示第几页
                currentPage:1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount:0,
                // 个数选择器（可修改）
                pageSizes:[10,20,50,100],
                // 默认每页显示的条数（可修改）
                PageSize:8,
                editVisibleFullText:false,
                content: '',

                handoutsUrl:[],//app下载地址
                platformOption:[{key:'安卓',value:'安卓'}],
                typeOption:[{key:'1',value:'不需要升级'},{key:'2',value:'不强制升级'},{key:'3',value:'强制升级'}],
                tableData: [],
                cur_page: 1,
                editVisible: false,
                delVisible: false,
                form: {
                    id: "",
                    title: "",
                    downurl: "",
                    platform: "安卓",
                    subcontent: "",
                    type: "1",
                    versioncode: "",
                    versionname:'',
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
            onUpLoadError(err){
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
            },
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize=val
                // 点击每页显示的条数时，显示第一页
                this.getData(val,1)
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage=1
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage=val
                // 切换页码时，要获取每页显示的条数
                this.getData(this.PageSize,(val)*(this.pageSize))
            },

            handoutsSuccess(res, file) {
                console.log(res)
                this.form.downurl=res;
            },

            handleRemoveHandouts(file, fileList) {
                this.form.downurl='';
            },

            deleteRow() {
                this.$axios
                    .post("/Versions/deleteVersions", { vid: this.form.id })
                    .then(res => {
                        if (!res.success) {
                            this.$message.success(res.errMsg);
                            return;
                        }
                        this.tableData.splice(this.idx, 1);
                        this.$message.success("删除成功");
                        this.delVisible = false;
                    });
            },
            dealTime(row) {
                if (row.createTime != null) {
                    var date1 = new Date(row.createTime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.toTimeString().substr(0, 8);;
                }else{
                    return '';
                }
            },
            dealType(row){
                //1.不需要升级2.不强制升级.3强制升级
                return row.type == '1' ?  '不需要升级' : row.type == '2' ? '不强制升级'  : '强制升级'
            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            getData() {
                this.$axios
                    .post("/Versions/queryVersions", {
                        pageNo:this.cur_page,
                        pageSize:this.PageSize,
                    })
                    .then(res => {

                        this.tableData = res.data.queryVersionsjson;
                        this.totalCount = res.data.count;

                    });
            },

            add() {
                //添加
                debugger
                console.log(this.handoutsUrl)
                this.editVisible = true;
                this.handoutsUrl = [];
                this.form = {
                    id: "",
                    title: "",
                    downurl: "",
                    platform: "安卓",
                    subcontent: "",
                    type: "1",
                    versioncode: "",
                    versionname:'',
                };
            },

            handleEdit(index, row) {

                this.idx = index;
                const item = this.tableData[index];

                this.form = {
                    id: item.id,
                    title: item.title,
                    downurl:item.downurl,
                    platform:item.platform,
                    subcontent: item.subcontent,
                    type: item.type,
                    versionname: item.versionname,
                    versioncode:item.versioncode
                };

                if(!!item.downurl){
                    this.handoutsUrl=[{name:item.downurl,url:item.downurl}];//app下载地址
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.form = row;
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                if(!fd.title){
                    this.$message.error(`更新标题不能为空`);
                    return;
                }
                if(!fd.downurl){
                    this.$message.error(`下载地址不能为空`);
                    return;
                }

                if(!fd.subcontent){
                    this.$message.error(`更新内容不能为空`);
                    return;
                }
                if(!fd.versioncode){
                    this.$message.error(`版本号不能为空`);
                    return;
                }
                if(!fd.versionname){
                    this.$message.error(`版本名称不能为空`);
                    return;
                }
                if (this.form.id == "") {
                    delete fd.id;
                    this.$axios.post("/Versions/addVersions", fd).then(res => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.editVisible = false;
                    });

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

</style>
