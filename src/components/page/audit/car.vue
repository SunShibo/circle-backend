<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades">车辆认证</i>
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
                <el-date-picker style="margin-right:10px;"
                        format="yyyy/MM/dd"
                        value-format="yyyy/MM/dd"
                        v-model="value7"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        :picker-options="pickerOptions2">
                </el-date-picker>

                <el-button type="primary" icon="add" @click="search" >查询</el-button>
            </div>
            <el-table
                    v-loading="$store.state.requestLoading"
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
            >

                <el-table-column prop="createTime" label="提交时间" :formatter="dealtime" width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="userId" label="用户ID" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="150" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="carNumber" label="车牌号" width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="carModels" label="车型" width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="carModelsNumber" label="车型编号" width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="licenseType" label="驾照类型" width="90"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="carCertificationStatus" label="状态" width="90"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="carModelsNumber" label="车型编号" width="150"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="车牌照片">
                    <template slot-scope="scope" width="100">
                        <img :src="scope.row.carNumberPicture" alt="" style="width: 70px;height: 70px">
                    </template>
                </el-table-column>
                <el-table-column label="行驶证照片" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.drivingPicture" alt="" style="width: 80px;height: 80px">
                    </template>
                </el-table-column>
                <el-table-column label="驾照照片" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.licensePicture" alt="" style="width: 80px;height: 80px">
                    </template>
                </el-table-column>
                <el-table-column label="认证照片" width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.carPicture	" alt="" style="width: 80px;height: 80px">
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" :formatter="dealTimeend" width="180"
                                 :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                @click="selectImg(scope.row)"
                        >查看图片
                        </el-button>
                        <el-button
                                v-if="scope.row.carCertificationStatus != 'yes'"
                                type="text"
                                @click="audit('yes', scope.row)"
                        >审核通过
                        </el-button>
                        <el-button
                                v-if="scope.row.carCertificationStatus != 'no'"
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

        <!--查看图片-->
        <el-dialog title="查看图片" :visible.sync="bigImgVisible" width="45%" center>
            <div style="display: inline-block;margin:7px;">
                <img :src="row.carNumberPicture" width="320" height="320"/>
            </div>
            <div style="display: inline-block;margin:7px;">
                <img :src="row.drivingPicture"  width="320" height="320"/>
            </div>
            <div style="display: inline-block;margin:7px;">
                <img :src="row.licensePicture" width="320" height="320"/>
            </div>
            <div style="display: inline-block;margin:7px;">
                <img :src="row.carPicture"  width="320" height="320"/>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="bigImgVisible = false">关 闭</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: 'imgAudit',
        data() {
            return {
                row: {},
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
                    statusOption: [{key: '认证中', value: 'audit'}, {key: '认证通过', value: 'yes'}, {
                        key: '认证失败',
                        value: 'no'
                    }],
                },
                form: {
                    id: '',
                    demoPicture: '',
                },
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
                value7: [,],
                idx: -1,
                bigImgVisible: false,
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
            sortFormat(row) {
                return row.sort == '0' ? '是' : '否';
            },

            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios
                    .post("/CarCertification/getCarIncidentList", {
                        pageNo: this.currentPage,
                        pageSize: this.PageSize,
                        status: this.query.status,
                        afterTime: this.value7[0],
                        beforeTime: this.value7[1],
                    })
                    .then(res => {
                        this.tableData = res.data.carCertificationBOS;
                        this.totalCount = res.data.count;
                    });
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
            selectImg(row) {
                this.row = row;
                this.bigImgVisible = true;
            },
            audit(status, row) {
                let str = status == 'yes' ? '通过' : '拒绝';
                this.$axios({
                    url: '/CarCertification/updUserReport',
                    method: 'POST',
                    data: {
                        id: row.id,
                        carCertificationStatus: status,
                        userId:row.userId,
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
