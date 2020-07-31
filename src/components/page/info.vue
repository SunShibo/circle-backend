<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <p>鉴定信息:</p>
        <el-form ref="form" :model="form" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item  label="发布时间">
                        <el-input  v-model="form.createTime"   :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="发布人">
                        <el-input v-model="form.userName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="form.appraisalTypeName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="鉴定状态" >
                        <el-input v-model="form.appraisalState"  :disabled="true" ></el-input>
                    </el-form-item>

                    <el-form-item required="" label="鉴定案例">
                        <el-select v-model="form.apCase">
                            <el-option
                                    v-for="item in apCase"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item required="" label="标题">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item required="" label="内容">
                        <el-input type="textarea" :rows="5" v-model="form.describc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <div v-for="(src,i) in images" style="display: inline-block;margin: 7px;">
                       <img :src="src" alt="破损图片" class="imgs"   title="点击删除"  @click="delImg(i)">
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <div style="text-align: center">
                <span slot="footer" class="dialog-footer">
                    <el-button @click="save" type="primary" >保存</el-button>
                </span>
        </div>

        <div class="container">
            <div class="handle-box">
               评论列表： <el-button type="primary" @click="add">添加评论</el-button>
            </div>

        <el-table
                :data="comment"
                border
                class="table"
                ref="multipleTable"
                v-loading="$store.state.requestLoading" >
            <el-table-column  label="用户头像" prop="apImages" width="100" >
                <template slot-scope="scope">
                    <img  :src="scope.row.headUrl" alt="" style="width: 50px;height: 50px" >
                </template>
            </el-table-column>
            <el-table-column  :show-overflow-tooltip="true" prop="userId"   label="评论人ID" width="80"></el-table-column>
            <el-table-column  :show-overflow-tooltip="true" prop="name"   label="评论人" width="180"></el-table-column>
            <el-table-column  :show-overflow-tooltip="true" prop="gradeName"   label="等级" width="180"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="cnComment" label="评论内容"></el-table-column>
            <el-table-column  prop="judge" label="评论状态" :formatter="commentStatus" > </el-table-column>
            <el-table-column  prop="goodsState" label="采纳状态"  :formatter="acceptStatus"  ></el-table-column>
            <el-table-column  prop="createTime" label="评论时间"></el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                  >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.$index, scope.row)" type="text"  v-if="scope.row.goodsState == 'yes'">查看纠错</el-button>
                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text"  v-if="scope.row.goodsState == 'no'" >删除</el-button>
                    <el-button @click="handleAppept(scope.$index, scope.row)" type="text"  v-if="scope.row.goodsState == 'no'" >采纳</el-button>
                    <el-button @click="handleAppept(scope.$index, scope.row)" type="text"  v-if="scope.row.goodsState == 'yes'" >取消采纳</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
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


        <!--纠错弹出层-->
        <el-dialog title="纠错" :visible.sync="editVisible" width="55%" :close-on-click-modal="closeOnClickModal">
            <el-table
                    :data="error"
                    border
                    class="table"
                    ref="multipleTable"
                    v-loading="$store.state.requestLoading"  >
                <el-table-column  :show-overflow-tooltip="true" prop="userId"   label="发布人ID" width="80"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true" prop="userName"     label="发布人" width="180"></el-table-column>
                <el-table-column  :show-overflow-tooltip="true" prop="ap_read"  :formatter="setStatus"  label="状态" width="80"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="content" label="内容"></el-table-column>
                <el-table-column  prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="accept(scope.$index, scope.row)" type="text">采纳</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
         </el-dialog>


        <!--添加评论弹出层-->
        <el-dialog title="添加评论" :visible.sync="commentBol" width="50%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="commentObj" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item required="" label="发布人">
                            <el-select v-model="commentObj.userId">
                                <el-option
                                        v-for="item in commentUser"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item required="" label="判断">
                            <el-select v-model="commentObj.judge">
                                <el-option
                                        v-for="item in judge"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item required="" label="内容">
                            <el-input type="textarea" :rows="8" v-model="commentObj.cnComment"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="commentBol = false">取 消</el-button>
                <el-button @click="addComment"  >保 存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="appept" width="300px" center>
            <div class="del-dialog-cnt">是否 采纳/取消采纳</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="appept = false">取 消</el-button>
                <el-button type="primary" :loading="$store.state.requestLoading" @click="cancel">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'UserManage',
        data() {
            return {
                commentBol:false,
                editVisible:false,
                delVisible:false,
                appept:false,
                goodsState:'',
                error:[],
                // 默认显示第几页
                currentPage: 1,
                // 总条数，根据接口获取数据长度(注意：这里不能为空)
                totalCount: 0,
                // 个数选择器（可修改）
                pageSizes: [10, 20, 50, 100],
                // 默认每页显示的条数（可修改）
                PageSize: 10,
                item: 0,
                statusOption:[{key:'待鉴定',value:'undetermined'},{key:'通过',value:'adopt'},{key:'未通过',value:'failedpass'}],
                apCase:[{key:'是',value:'yes'},{key:'否',value:'no'}],//是否鉴定案例
                judge:[{key:'真',value:'genuine'},{key:'假',value:'counterfeit'}],//是否鉴定案例
                images:[],
                comment:[],//评论列表
                commentUser:[],
                form:{
                  id:'',
                  createTime:'',
                  userName:'',//发布人
                  appraisalTypeName:'',//发布类型
                  title:'',//标题
                  appraisalState:'',//鉴定状态
                  apCase:'',//是否成为鉴定案例
                  describc:'' ,//内容
                  apImages:'',
                },
                commentObj:{
                    appraisalId:'',
                    userId:'',
                    cnComment:'',//内容
                    judge:'',//真假  genuine   counterfeit
                }
            }
        },
        //上来就加载的方法
        created() {
            //在获取数据前判断路由传值对象是否为空
            this.item =  this.$route.query.id;
            this.getData();
            this.init();
        },
        methods: {
            init(){
                this.$axios.post("/appraisal/appraisalDetails", {
                    appraisalId:this.item
                }).then(res => {
                    this.images = res.data.img;
                    this.form.id = res.data.appraisal.id;
                    this.form.createTime= res.data.appraisal.createTime;
                    this.form.userName= res.data.appraisal.userName;
                    this.form.appraisalTypeName= res.data.appraisal.appraisalTypeName;
                    this.form.title= res.data.appraisal.title;
                    this.form.appraisalState= this.statusMatter(res.data.appraisal);
                    this.form.apCase= res.data.appraisal.apCase;
                    this.form.describc= res.data.appraisal.describc;
                });
            },
            getData(){
                this.$axios.post("/appraisal/appraisalComment", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    appraisalId:this.item
                }).then(res => {
                    this.comment = res.data.commentbos;
                    this.totalCount = res.data.count;
                });
            },
            add(){
                this.commentBol=true;
                this.commentObj.appraisalId=this.item;
                this.$axios.post("/user/querySystemUser", {
                }).then(res => {
                    this.commentUser = res.data;
                });
            },
            addComment(){
                console.log(this.commentObj);
                let fd = JSON.parse(JSON.stringify(this.commentObj));
                this.$axios.post("/comment/addComment",fd)
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.commentBol=false;
                        this.getData();
                    });
            },
            save(){

                this.form.apImages=this.images.join(",");
                let fd = JSON.parse(JSON.stringify(this.form));
                delete fd.createTime;
                delete fd.appraisalState;
                this.$axios.post("/appraisal/updateAppraisal",fd)
                    .then(res => {
                        this.$message.success(`操作成功`);
                        this.getData();
                        this.init();
                });
            },
            delImg(idex){
                this.images.splice(idex,1);
            },
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
            statusMatter(row) {
                if (row.appraisalState == 'undetermined') {
                    return '未鉴定';
                }
                if (row.appraisalState == 'adopt') {
                    return '真';
                }
                if (row.appraisalState == 'failedpass') {
                    return '假';
                }
                return '';
            },
            acceptStatus(val) {
              if("yes"==val.goodsState){
                  return "已采纳"
              }
              if("no"==val.goodsState){
                  return "未采纳";
              }
              return "";
            },
            commentStatus(val){
                if("counterfeit"== val.judge){
                    return "假"
                }
                if("genuine"==val.judge){
                    return "真";
                }
                return "";
            },
            setStatus(val){
                if("accept"== val.status){
                    return "采纳";
                }
                return "未采纳";
            },
            handleClick(index,row){
                this.$axios.post("/appraisal/apprasialReised", {
                   commentId:row.id
                }).then(res => {
                    this.error=res.data;
                    this.editVisible=true;
                });
           },
            accept(index,row){
                this.$axios.post("/reised/adoptReised", {
                    reisedId:row.id
                }).then(res=> {
                    this.$message.success(`操作成功`);
                });
                this.editVisible=false;
                this.getData();
            },
            handleDelete(index, row) {
                this.form.id = row.id;
                this.delVisible = true;
            },

            deleteRow() {
                this.$axios
                    .post("/comment/deleteCommentById", { id: this.form.id })
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.getData();
                        this.$message.success("删除成功");
                        this.delVisible = false;
                    });
            },
            handleAppept(index,row) {  //取消采纳
                this.appept = true;
                this.form.id=row.id;
                this.goodsState=row.goodsState;
            },
            cancel() {
                let status=this.goodsState=='no'?"yes":'no';
                this.$axios
                    .post("/comment/commentGoods", { id: this.form.id ,state:status})
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.errMsg);
                            return;
                        }
                        this.getData();
                        this.$message.success("操作成功");
                        this.delVisible = false;
                    });

                this.appept = false;
            },

        },
        watch: {
            '$route': function (newData, oldData) {
                this.item = newData.query.id;
                if(this.item){
                    this.getData();
                    this.init();
                }
            }
        }

    }
</script>

<style scoped>
    .imgs {
        width: 130px;
        height: 100px;

    }
    .imgs:hover {
        width: 130px;
        height: 100px;
        border-style: solid;
        border-width: 2px;
        border-color: red;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }

</style>
