<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 采纳修改日志
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="userName" placeholder="用户名" class="handle-input"></el-input>
                <span class="demonstration"> 选择时间：</span>
                <el-date-picker
                        v-model="value2"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy/MM/dd HH:mm:ss"
                        value-format="yyyy/MM/dd HH:mm:ss"
                        align="right"
                        :clearable="clearable"
                >
                </el-date-picker>
                <span class="search"><el-button type="primary" icon="search" @click="_search">查询</el-button> </span>
            </div>

            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
            >
                <el-table-column prop="createTime" label="日期"></el-table-column>
                <el-table-column prop="adminName" label="操作员"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="type"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="content" label="评论内容"  :show-overflow-tooltip="true" ></el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleNoChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'exchangeRecords',
        data() {
            return {
                clearable:false,
                userName:'',
                value2:[],
                // 总数据
                tableData:[],
                statementDay:{},
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                pickerOptions: {
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
                cur_page: 1,
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
                this.PageSize = val
                // 点击每页显示的条数时，显示第一页
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage = 1;
                this.getData();
            },
            // 显示第几页
            handleNoChange(val) {
                // 改变默认的页数
                this.currentPage = val;
                // 切换页码时，要获取每页显示的条数
                this.getData();
            },

            dealTime(row) {
                if (row.grReleasetime != null) {
                    var date1 = new Date(row.grReleasetime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                }else{
                    return '';
                }
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            getData() {
                this.$axios
                    .post("/comment/queryAcceptLog", {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                        userName:this.userName,
                        startTime:this.value2[0],
                        endTime: this.value2[1],
                    })
                    .then(res => {
                        this.tableData = res.data.list;
                        this.totalCount = res.data.count;
                    });
            },
            _search() {
                this.getData();
            },
            type(row){
                if(row.type=='error'){
                    return "纠错";
                }
                if(row.type=='accept'){
                    return "采纳";
                }
                if(row.type=='cancel'){
                    return "取消采纳";
                }
                if(row.type=='del'){
                    return "删除";
                }
                return "";
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
    .el-input{
        width: 120px!important;
    }
    .search{
      margin-left: 10px;
    }
</style>
