<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades">用户列表</i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.phone" placeholder="手机号" class="handle-input"></el-input>
                虚拟用户：
                <el-select v-model="query.robotStatus" style="margin-right:10px;width:100px;" placeholder="全部">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.statusOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                用户认证状态：
                <el-select v-model="query.certificationStatus" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.certificationOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                汽车认证状态：
                <el-select v-model="query.carStatus" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.carOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                用户状态：
                <el-select v-model="query.userStatus" style="margin-right:10px;width:100px;">
                    <el-option value="">全部</el-option>
                    <el-option
                            v-for="item in query.userOption"
                            :key="item.key"
                            :label="item.key"
                            :value="item.value"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search" class="handle-input-search">搜索</el-button>
            </div>

            <el-table
                    :data="data"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"
            >
                <el-table-column label="ID" width="100" prop="id"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="注册时间" prop="createTime" :formatter="dealTime"></el-table-column>
                <el-table-column label="是否拉黑" prop="userStatus" :formatter="userStatus"></el-table-column>
                <el-table-column label="认证状态" prop="certificationStatus" :formatter="statusForm"></el-table-column>
                <el-table-column label="车辆认证状态" prop="carStatus" :formatter="carForm"></el-table-column>
                <el-table-column label="虚拟用户" prop="robotStatus" :formatter="system"></el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-search" @click="getUserById(scope.$index, scope.row)">查看
                        </el-button>
                        <el-button type="text"  @click="selectFriend(scope.$index, scope.row)">查看好友
                        </el-button>
                        <el-button v-if="scope.row.userStatus=='no'" type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('yes', scope.row)">拉黑
                        </el-button>
                        <el-button v-else type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete('no', scope.row)">取消拉黑
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


        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="showVisible" width="60%" :close-on-click-modal="closeOnClickModal">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="DATE" name="first" v-if="dateVisible">
                    <div class="divs">
                        <div style="width: 70%">
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">昵称：</el-col>
                                <el-col :span="6">{{date.name}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">性别：</el-col>
                                <el-col :span="6">{{date.sex }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">生日：</el-col>
                                <el-col :span="6">{{date.birthday | dealTime1}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">出生地：</el-col>
                                <el-col :span="6">{{date.birthplace }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">星座：</el-col>
                                <el-col :span="6">{{date.constellation }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">身高：</el-col>
                                <el-col :span="6">{{date.height }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">体重：</el-col>
                                <el-col :span="6">{{date.weight }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">教育：</el-col>
                                <el-col :span="6">{{date.education}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被喜欢数：</el-col>
                                <el-col :span="6">{{date.beLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被超级喜欢数：</el-col>
                                <el-col :span="6">{{date.beSuperLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被屏蔽次数：</el-col>
                                <el-col :span="6">{{date.beShieldingCount}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">说点什么：</el-col>
                                <el-col :span="6">{{date.describe }}</el-col>
                            </el-row>
                        </div>
                        <div>
                            <div>
                                <div v-for="(src,i) in date.pictureBOList" style="display: inline-block;margin: 7px;" >
                                    <img :src="src.pictureUrl" alt="破损图片" class="imgs">
                                </div>
                            </div>
                            <div>
                                <div v-for="(item,i) in date.interestTypeBOList" class="interse" >
                                    {{item.typeName}}:<span  v-for="(i) in item.interestBOList"> {{i.interestName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="FRIEND" name="second" v-if="friendVisible">
                    <div class="divs">
                        <div style="width: 70%">
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">昵称：</el-col>
                                <el-col :span="6">{{friend.name}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">性别：</el-col>
                                <el-col :span="6">{{friend.sex }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">生日：</el-col>
                                <el-col :span="6">{{friend.birthday | dealTime1}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">出生地：</el-col>
                                <el-col :span="6">{{friend.birthplace }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">星座：</el-col>
                                <el-col :span="6">{{friend.constellation }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">身高：</el-col>
                                <el-col :span="6">{{friend.height }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">体重：</el-col>
                                <el-col :span="6">{{friend.weight }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">教育：</el-col>
                                <el-col :span="6">{{friend.education}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被喜欢数：</el-col>
                                <el-col :span="6">{{friend.beLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被超级喜欢数：</el-col>
                                <el-col :span="6">{{friend.beSuperLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被屏蔽次数：</el-col>
                                <el-col :span="6">{{friend.beShieldingCount}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">说点什么：</el-col>
                                <el-col :span="6">{{friend.describe }}</el-col>
                            </el-row>
                        </div>
                        <div>
                            <div>
                                <div v-for="(src,i) in friend.pictureBOList" style="display: inline-block;margin: 7px;" >
                                    <img :src="src.pictureUrl" alt="破损图片" class="imgs">
                                </div>
                            </div>
                            <div>
                                <div v-for="(item,i) in friend.interestTypeBOList" class="interse" >
                                    {{item.typeName}}:<span  v-for="(i) in item.interestBOList"> {{i.interestName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="CAR" name="third" v-if="carVisible">
                    <div class="divs">
                        <div style="width: 70%">
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">昵称：</el-col>
                                <el-col :span="6">{{car.name}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">性别：</el-col>
                                <el-col :span="6">{{car.sex }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">生日：</el-col>
                                <el-col :span="6">{{car.birthday | dealTime1}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">出生地：</el-col>
                                <el-col :span="6">{{car.birthplace }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">星座：</el-col>
                                <el-col :span="6">{{car.constellation }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">身高：</el-col>
                                <el-col :span="6">{{car.height }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">体重：</el-col>
                                <el-col :span="6">{{car.weight }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">教育：</el-col>
                                <el-col :span="6">{{car.education}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被喜欢数：</el-col>
                                <el-col :span="6">{{car.beLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被超级喜欢数：</el-col>
                                <el-col :span="6">{{car.beSuperLikeCount }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">被屏蔽次数：</el-col>
                                <el-col :span="6">{{car.beShieldingCount}}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row">
                                <el-col :span="6" class="text">说点什么：</el-col>
                                <el-col :span="6">{{car.describe }}</el-col>
                            </el-row>
                        </div>
                        <div>
                            <div>
                                <div v-for="(src,i) in car.pictureBOList" style="display: inline-block;margin: 7px;" >
                                    <img :src="src.pictureUrl" alt="破损图片" class="imgs">
                                </div>
                            </div>
                            <div>
                                <div v-for="(item,i) in car.interestTypeBOList" class="interse" >
                                    {{item.typeName}}:<span  v-for="(i) in item.interestBOList"> {{i.interestName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showVisible = false">关 闭</el-button>
            </span>
        </el-dialog>





        <!-- 好友 -->
        <el-dialog title="备注" :visible.sync="selectVisible" center width="70%">
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
                                 :formatter="dealTime"
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
            <el-button @click="selectVisible = false">关 闭</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>

    import UpLoad from '../../common/Upload.vue';

    export default {
        name: 'UserManage',
        components: {UpLoad},
        data() {
            return {
                selectVisible:false,
                friendData:[],
                //user集合
                data: [],
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,

                // 默认显示第几页
                currentPage1: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount1: 0,
                // 个数选择器（可修改）
                pageSizes1: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize1: 10,

                model: [],
                date: {},
                friend: {},
                car: {},
                form: {},
                showVisible: false,//控制显示查看弹出层
                addVisible: false,//修改弹出框
                dateVisible: false,
                friendVisible: false,
                carVisible: false,
                sexx: [{key: '男', value: '男'}, {key: '女', value: '女'}],
                //查询条件
                query: {
                    phone: '',
                    //系统用户
                    robotStatus: 'no',
                    statusOption: [{key: '是', value: 'yes'}, {key: '否', value: 'no'}],
                    // 用户认证状态 认证状态（yes为已经认证|no为未认证|not未审核|audit审核中）
                    certificationStatus: '',
                    certificationOption: [{key: '未认证', value: 'no'}, {key: '未审核', value: 'not'}, {
                        key: '审核中',
                        value: 'audit'
                    }, {key: '以认证', value: 'yes'}],
                    //车辆认证状态 汽车认证状态（yes为已经认证|no为未认证|not未审核|audit审核中）
                    carStatus: '',
                    carOption: [{key: '未认证', value: 'no'}, {key: '未审核', value: 'not'}, {
                        key: '审核中',
                        value: 'audit'
                    }, {key: '以认证', value: 'yes'}],
                    //用户状态
                    userStatus: '',
                    userOption: [{key: '正常', value: 'no'}, {key: '拉黑', value: 'yes'}],

                },
                activeName2: 'first'
            };
        },
        created() {
            this.getData();
        },
        filters: {
            arrJoin(arr) {
                if (arr == null) {
                    return "";
                }
                return arr.join(",");
            },
            dealTime1(strBirthday) {
                if (strBirthday != null) {
                    var date1 = new Date(strBirthday.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                } else {
                    return '';
                }
            },
            FormatData: (value) => {
                return value ? value : "无";
            },
            /*根据出生日期算出年龄*/
            jsGetAge(strBirthday) {
                if (!strBirthday) return '无';
                const date = new Date(strBirthday.time),
                    birthYear = date.getFullYear(),
                    birthMonth = date.getMonth() + 1,
                    birthDay = date.getDate();
                let returnAge;

                const d = new Date();
                const nowYear = d.getFullYear();
                const nowMonth = d.getMonth() + 1;
                const nowDay = d.getDate();

                if (nowYear == birthYear) {
                    returnAge = 0;//同年 则为0岁
                } else {
                    const ageDiff = nowYear - birthYear; //年之差
                    if (ageDiff > 0) {
                        if (nowMonth == birthMonth) {
                            const dayDiff = nowDay - birthDay;//日之差
                            if (dayDiff < 0) {
                                returnAge = ageDiff - 1;
                            } else {
                                returnAge = ageDiff;
                            }
                        } else {
                            const monthDiff = nowMonth - birthMonth;//月之差
                            if (monthDiff < 0) {
                                returnAge = ageDiff - 1;
                            } else {
                                returnAge = ageDiff;
                            }
                        }
                    } else {
                        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                    }
                }

                return returnAge;//返回周岁年龄

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

            handleSizeChange1(val) {
                // 改变每页显示的条数
                this.PageSize1 = val;
                // 点击每页显示的条数时，显示第一页
                this.currentPage1 = 1;
                this.getFriend();
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
            },
            // 显示第几页
            handleCurrentChange1(val) {
                // 改变默认的页数
                this.currentPage1 = val;
                // 切换页码时，要获取每页显示的条数
                this.getFriend()
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.post("/user/getUserList", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    phone: this.query.phone,
                    certificationStatus: this.query.certificationStatus,
                    carStatus: this.query.carStatus,
                    userStatus: this.query.userStatus,
                    robotStatus:this.query.robotStatus
                }).then(res => {
                    this.data = res.data.userBOS;
                    this.totalCount = res.data.count;
                });
            },
            //根据条件搜索
            search() {
                this.getData();
            },
            userStatus(row) {
                return row.userStatus == 'yes' ? '是' : '否';
            },
            system(row) {
                return row.robotStatus == 'yes' ? '是' : '否';
            },
            statusForm(row) {
                for (let i = 0; i < this.query.certificationOption.length; i++) {
                    if (this.query.certificationOption[i].value == row.certificationStatus) {
                        return this.query.certificationOption[i].key;
                    }
                }
            },
            carForm(row) {
                for (let i = 0; i < this.query.carOption.length; i++) {
                    if (this.query.carOption[i].value == row.carStatus) {
                        return this.query.carOption[i].key;
                    }
                }
            },
            selectFriend(index,row){``
                this.userId=row.id;
                this.currentPage1=1;
                this.PageSize1=10;
                this.getFriend();
                this.selectVisible=true;
            },
            getFriend(){
                this.$axios
                    .post("/MatchingFriendEd/getFriendsList", {
                        userId: this.userId ,
                        pageNo: this.currentPage1,
                        pageSize: this.PageSize1,
                    })
                    .then(res => {
                        this.friendData = res.data.matchingFriendEdBOS;
                        this.totalCount1=res.data.count;
                    });
            },
            //拉黑
            handleDelete(status, row) {

                let str = status == 'yes' ? '拉黑' : '取消拉黑';
                if (!row.id) {
                    this.$message.error(str + '失败');
                    return;
                }
                this.$confirm('此操作将' + str + '该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/user/updUserStatus',
                        method: 'POST',
                        data: {
                            userId: row.id,
                            status: status,
                        },
                    }).then(res => {
                        if (res) {
                            this.$message.success(str + "成功");
                            this.getData();
                        }
                    });
                })
            },


            //查看选项卡
            handleClick(tab, event) {
            },

            //查看单个用户
            getUserById(index, row) {
                this.date = {};
                this.dateVisible = false;
                this.car = {};
                this.carVisible = false;
                this.friend = {};
                this.friendVisible = false;
                this.$axios.post("/user/getModelByUserId", {
                    userId: row.id
                }).then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].model == 'date') {
                            this.date = res.data[i];
                            this.dateVisible = true;
                        } else if (res.data[i].model == 'car') {
                            this.car = res.data[i];
                            this.carVisible = true;
                        } else if (res.data[i].model == 'friend') {
                            this.friend = res.data[i];
                            this.friendVisible = true;
                        }
                    }

                });
                this.showVisible = true;
            },
            dealTime(row) {
                if (row.createTime != null) {
                    var date1 = new Date(row.createTime.time);
                    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
                } else {
                    return '';
                }
            },
            friendForm(row) {
                return row.friendsStatus == 'yes' ? '成为好友' : '已取消好友';
            }
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
        width: 150px;
        margin-left: 10px;
        display: inline-block;
    }

    .handle-input-search {
        margin-left: 10px;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .divs {
        display: flex;
        justify-content: space-between;
    }

    .text {
        text-align: right;
    }

    .imgs {
        width: 100px;
        height: 80px;
    }
    .interse{
        line-height:30px ;
    }
    .row {
        padding: 5px 0;
    }
</style>

