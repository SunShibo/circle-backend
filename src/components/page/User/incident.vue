<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">用户行程</i>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search.userId" placeholder="用户ID" style="margin-right:10px;width:100px;"></el-input>
                <el-input v-model="search.phone" placeholder="手机号" style="margin-right:10px;width:100px;"></el-input>
                状态:
                <el-select v-model="search.status" placeholder="状态" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in statusOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                时间:
                <el-date-picker style="margin-right:10px;"
                        value-format="yyyy/MM/dd"
                        v-model="value7"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2">
                </el-date-picker>

                <el-button type="primary" icon="search"  @click="_search">搜索</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="200px"
                        :formatter="dealTimeend"
                >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="incident"
                                 label="事件"
                >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 :formatter="statusForm"
                                 prop="incidentStatus"
                                 label="状态">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="userId"
                                 label="用户ID">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="origin"
                                 label="起点">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="destination"
                                 label="终点">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 :formatter="updTimeend"
                                 prop="incidentTime"
                                 label="时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button @click="handleClick( scope.row)" type="text">查看匹配列表</el-button>
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


        <!-- 查看 -->
        <el-dialog title="备注" :visible.sync="editVisible" center width="70%">
            <el-table
                    :data="friendData"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >

                <el-table-column
                        prop="userId"
                        label="用户ID"
                >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="userPhone"
                                 label="手机号"
                >
                </el-table-column>
                <el-table-column
                        prop="friendsId"
                        label="用户ID"
                >
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 prop="friendPhone"
                                 label="手机号"
                >
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true"
                                 prop="model"
                                 label="模式">
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true"
                                 prop="friendsStatus"
                                 :formatter="friendForm"
                                 label="状态">

                </el-table-column>

                <el-table-column :show-overflow-tooltip="true"
                                 prop="createTime"
                                 label="创建时间"
                                 :formatter="dealTimeend"
                >
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        :page-sizes="pageSizes1"
                        :page-size="PageSize1"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount1">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">关 闭</el-button>
      </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: 'banner',
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


                userId: '',
                currentPage1: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount1: 0,
                // 个数选择器（可修改）
                pageSizes1: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize1: 10,
                tableData: [],
                search: {
                    status: '',
                    phone: '',
                    userId: '',
                    time: '',
                },
                friendData: [],
                value4: ['', ''],
                statusOption: [{key: '发布中', value: 'yes'}, {key: '已取消', value: 'no'}],
                editVisible: false,
                idx: -1,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value7: [],
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
                this.PageSize = val
                // 点击每页显示的条数时，显示第一页
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage = 1;
                this.getData();
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData();
            },

            handleSizeChange1(val) {
                // 改变每页显示的条数
                this.PageSize1 = val
                // 点击每页显示的条数时，显示第一页
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage1 = 1;
                this.getreiend();
            },
            // 显示第几页
            handleCurrentChange1(val) {
                // 改变默认的页数
                this.currentPage1 = val;
                // 切换页码时，要获取每页显示的条数
                this.getreiend();
            },


            updTimeend(row) {
                if (row.incidentTime != null) {
                    let date1=new Date(row.incidentTime.time);
                    return  date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            dealTimeend(row) {
                if (row.createTime != null) {
                    return this.returnTime(row.createTime.time);
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
                    .post("/CarIncident/getCarIncidentList", {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                        userId: this.search.userId,
                        phone: this.search.phone,
                        beforeTime: this.value7[1],
                        afterTime: this.value7[0],
                        incidentStatus: this.search.status
                    })
                    .then(res => {
                        console.log(res.data);
                        this.tableData = res.data.carIncidentBOS;
                        this.totalCount = res.data.count;
                    });
            },
            _search() {
                this.getData();
            },
            statusForm(row) {
                return row.incidentStatus == 'yes' ? "发布中" : "已取消";
            },
            // 更改已读未读
            handleClick(row) {
                this.userId = row.userId;
                this.currentPage1 = 1;
                this.PageSize1 = 10;
                this.getreiend();
                this.editVisible = true;
            },
            getreiend() {
                this.$axios
                    .post("/CarIncident/getFriendsByCarIncident", {
                        userId: this.userId,
                        pageNo: this.currentPage1,
                        pageSize: this.PageSize1,
                    })
                    .then(res => {
                        this.friendData = res.data.matchingFriendEdBOS;
                        this.totalCount1 = res.data.count;
                    });
            },
            friendForm(row) {
                return row.friendsStatus == 'yes' ? '成为好友' : '已取消好友';
            }
        },
    }
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

    .mr10 {
        margin-right: 10px;
    }

    .redClass {
        color: red;
    }
</style>
