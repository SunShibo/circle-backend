<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 报表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-date-picker
                        v-model="search.time"
                        align="right"
                        type="date"
                        value-format="yyyy/MM/dd"
                        placeholder="发布时间"
                        :picker-options="pickerOptions">
                </el-date-picker>

                <el-button type="primary" icon="search" @click="_search">查询</el-button>
                <!-- <el-button type="primary" icon="add" @click="add">新增</el-button> -->
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
            >

                <el-table-column prop="typeName" label="分类"></el-table-column>
                <el-table-column prop="dayCount" label="当日"></el-table-column>
                <el-table-column prop="monthCount" label="当月"></el-table-column>
                <el-table-column prop="yearCount" label="当年"></el-table-column>


            </el-table>

        </div>

    </div>
</template>

<script>

    export default {
        name: 'exchangeRecords',
        data() {
            return {
                // 总数据
                tableData:[],
                statementDay:{},
                // 默认显示第几页
                currentPage:1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount:0,
                // 个数选择器（可修改）
                pageSizes:[8,20,50,100],
                // 默认每页显示的条数（可修改）
                PageSize:8,


                search:{
                    date:this.formatDateCommon(new Date()),
                },
                pickerOptions: {//date日期选择器配置
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
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
                    .post("/statementController/getStatement", {
                        ...this.search
                    })
                    .then(res => {
                        this.tableData = res.data;
                    });
            },

            _search() {
                this.getData();
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 100px;
        display: inline-block;
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
    .mr10 {
        margin-right: 10px;
    }

    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
