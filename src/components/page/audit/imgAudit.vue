<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">图像审核</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                审核状态：
                <el-select v-model="query.status" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.statusOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                模式：
                <el-select v-model="query.model" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.modelOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                首图：
                <el-select v-model="query.sort" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.sortOption"
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
                <el-table-column prop="model" label="模式" :formatter="modelFormat"></el-table-column>
                <el-table-column prop="sort" label="是否首图" :formatter="sortFormat"></el-table-column>
                <el-table-column prop="pictureStatus" label="审核状态" :formatter="statusFormat"></el-table-column>
                <el-table-column label="图像" prop="url">
                    <template slot-scope="scope">
                        <img :src="scope.row.pictureUrl" alt="" style="width: 70px;height: 70px">
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="上传时间" :formatter="dealtime"></el-table-column>
                <el-table-column prop="updateTime" label="审核时间" :formatter="dealTimeend"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.pictureStatus == 'audit' "
                                type="text"
                                @click="audit('yes', scope.row)"
                        >审核通过
                        </el-button>
                        <el-button
                                v-if="scope.row.pictureStatus != 'no'"
                                type="text"
                                class="red"
                                @click="audit('no', scope.row)"
                        >审核拒绝
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
    </div>
</template>

<script>

    export default {
        name: 'imgAudit',
        data() {
            return {
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
                addVisible: false,
                query: {
                    status: '',
                    statusOption: [{key: '审核中', value: 'audit'}, {key: '审核通过', value: 'yes'}, {
                        key: '审核失败',
                        value: 'no'
                    }],
                    model: '',
                    modelOption: [{key: 'DATE', value: 'date'}, {key: 'FRIEND', value: 'friend'}, {
                        key: 'CAR',
                        value: 'car'
                    }],
                    sort: '',
                    sortOption: [{key: '是', value: '0'}, {key: '否', value: null}],
                },
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
            dealtime(row) {
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
            sortFormat(row){
                return row.sort=='0'?'是':'否';
            },
            modelFormat(row) {
                for (let i = 0; i < this.query.modelOption.length; i++) {
                    if (row.model == this.query.modelOption[i].value) {
                        return this.query.modelOption[i].key;
                    }
                }
            },
            statusFormat(row) {
                for (let i = 0; i < this.query.statusOption.length; i++) {
                    if (row.pictureStatus == this.query.statusOption[i].value) {
                        return this.query.statusOption[i].key;
                    }
                }

            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/userPicture/getPictureByStatus", {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                        status: this.query.status,
                        model: this.query.model,
                        sort: this.query.sort
                    })
                    .then(res => {
                        this.tableData = res.data.pictureBOS;
                        this.totalCount = res.data.count;
                    });
            },
            add() {
                //添加
                this.demoPicture = [],
                    this.addVisible = true;
                this.form = {
                    id: '',
                    demoPicture: '',
                };
            },
            search() {
                this.getData();
            },
            handleDelete(index, row) {
                this.form = {
                    id: row.id,
                    interestName: row.interestName,
                    typeId: row.typeId
                };
                this.delVisible = true;
            },
            audit(status, row) {
                let str = status == 'yes' ? '通过' : '拒绝';
                this.$axios({
                    url: '/userPicture/updPictureById',
                    method: 'POST',
                    data: {
                        id: row.id,
                        pictureStatus: status,
                    },
                }).then(res => {
                    if (res) {
                        this.$message.success(str + "成功");
                        this.getData();
                    }
                });
            }

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
