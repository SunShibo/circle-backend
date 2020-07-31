<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">用户认证</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                认证状态：
                <el-select v-model="query.status" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.statusOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="add" @click="search">查询</el-button>
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="userCreateTime" label="用户注册时间" :formatter="userTime"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="用户手机号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="认证图" prop="url">
                    <template slot-scope="scope">
                        <img :src="scope.row.userPicture" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column label="案例图" prop="url">
                    <template slot-scope="scope">
                        <img :src="scope.row.demoPicture" alt="" style="width: 50px;height: 50px">
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" prop="createTime" :formatter="dealTime"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="修改时间" prop="" :formatter="dealTime"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="认证状态" prop="status" :formatter="statusForm"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作员" prop="adminName" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                                   type="text"
                                   icon="el-icon-search"
                                   @click="selectBigImg(scope.row)"
                        >查看大图
                        </el-button>
                        <el-button v-if="scope.row.status!='yes'"
                                   type="text"
                                   icon="el-icon-success"
                                   @click="handleStatus(scope.row,'yes')"
                        >通过
                        </el-button>
                        <el-button
                                v-if="scope.row.status!='no'"
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleStatus(scope.row,'no')"
                        >拒绝
                        </el-button>
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

        <!-- 修改 -->
        <el-dialog title="备注" :visible.sync="delVisible" width="400px" center>

            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" :loading="$store.state.requestLoading" @click="saveEdit">确 定</el-button>
      </span>
        </el-dialog>


        <el-dialog title="查看大图" :visible.sync="bigImgVisible" width="65%" center>
            <el-row :gutter="20">
                <el-col :span="12">
                    <img :src="row.demoPicture" width="450" height="430"/>
                </el-col>
                <el-col :span="12">
                    <img :src="row.userPicture"  width="450" height="430" />
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
        <el-button @click="bigImgVisible = false">关 闭</el-button>
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
                row:{},
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                demoPicture: [],
                tableData: [],
                delVisible: false,
                bigImgVisible: false,
                query: {
                    status: '',
                    statusOption: [{key: '审核中', value: 'audit'}, {key: '认证通过', value: 'yes'}, {
                        key: '认证失败',
                        value: 'no'
                    }],
                },
                form: {
                    id: '',
                    status: '',
                    remark: ''
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
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize = val;
                // 点击每页显示的条数时，显示第一页
                this.currentPage = 1;
                this.getData();
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData()
            },
            userTime(row) {
                if (row.userCreateTime != null) {
                    return this.returnTime(row.userCreateTime.time);
                } else {
                    return '';
                }
            },
            dealTime(row) {
                if (row.createTime != null) {
                    return this.returnTime(row.createTime.time);
                } else {
                    return '';
                }
            },
            statusForm(row) {
                for (let i = 0; i < this.query.statusOption.length; i++) {
                    if (row.status == this.query.statusOption[i].value) {
                        return this.query.statusOption[i].key;
                    }
                }
                return "";
            },
            dealTimeend(row) {
                if (row.updateTime != null) {
                    return this.returnTime(row.updateTime.time);
                } else {
                    return '';
                }
            },
            returnTime(time) {
                var date1 = new Date(time);
                return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/user/getUserCertification", {
                        status: this.query.status
                    })
                    .then(res => {
                        this.tableData = res.data.userCertificationBOS;
                        this.totalCount = res.data.count;
                    });
            },
            search() {
                this.getData();
            },
            handleStatus(row, status) {
                this.form = {
                    id: row.id,
                    status: status,
                    remark: row.remark,
                };
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let fd = JSON.parse(JSON.stringify(this.form));
                this.$axios.post("/user/updUserCertificationStatus", fd).then(res => {
                    if (!res.success) {
                        this.$message.success(res.errMsg);
                        return;
                    }
                    this.$message.success(`操作成功`);
                    this.getData();
                    this.delVisible = false;
                });
            },
            selectBigImg(row) {
                this.row=row;
                this.bigImgVisible = true;
            },
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

    .red {
        color: #ff0000;
    }


</style>