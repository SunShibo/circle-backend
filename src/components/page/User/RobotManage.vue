<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades">虚拟用户管理</i></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.phone" placeholder="手机号" class="handle-input"></el-input>
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
                <el-button type="primary" icon="search" @click="add" class="handle-input-search">添加系统用户</el-button>

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
                <el-table-column label="创建时间" prop="createTime" :formatter="dealTime"></el-table-column>
                <el-table-column label="是否拉黑" prop="userStatus" :formatter="userStatus"></el-table-column>
                <el-table-column label="认证状态" prop="certificationStatus" :formatter="statusForm"></el-table-column>
                <el-table-column label="车辆认证状态" prop="carStatus" :formatter="carForm"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-search" @click="getUserById(scope.$index, scope.row)">编辑
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
        <el-dialog title="添加/编辑" :visible.sync="showVisible" width="60%" :close-on-click-modal="closeOnClickModal">
            <el-form ref="form" :model="form" label-width="120px">
                <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                    <el-tab-pane label="用户基本信息" name="first">
                        <el-form-item label="手机号" prop="phone"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                            <el-input v-model="form.phone" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="北纬" prop="latitude"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                            <el-input v-model="form.latitude" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="东经" prop="longitude"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                            <el-input v-model="form.longitude" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password"
                                      :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                            <el-input type="password" v-model="form.password" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="认证状态" prop="certificationStatus"
                                      :rules="[{required: true, message: '请选择', trigger: 'change,blur'}]">
                            <el-select v-model="form.certificationStatus" class="handle-input">
                                <el-option
                                        v-for="item in query.certificationOption"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="车辆状态" prop="carStatus"
                                      :rules="[{required: true, message: '请选择', trigger: 'change,blur'}]">
                            <el-select v-model="form.carStatus" class="handle-input">
                                <el-option
                                        v-for="item in query.carOption"
                                        :key="item.value"
                                        :label="item.key"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="DATE" name="date">
                        <div>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="昵称"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="date.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">

                                        <el-radio-group v-model="date.sex" size="small">
                                            <el-radio-button label="男"></el-radio-button>
                                            <el-radio-button label="女"></el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="生日"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-date-picker
                                                format="yyyy/MM/dd"
                                                value-format="yyyy/MM/dd"
                                                v-model="date.birthday"
                                                type="date"
                                                :picker-options="pickerOptions"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="出生地"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <!--                                        <el-input v-model="date.birthplace"></el-input>-->
                                        <el-cascader
                                                v-model="date.birthplace"
                                                :options="options"
                                                :props="{ expandTrigger: 'click', value: 'name', label: 'name', children: 'chinaRegionBOList' }"
                                                @change="handleCascaderChange"></el-cascader>
                                    </el-form-item>
                                    <el-form-item label="星座"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <!--                                        <el-input v-model="date.constellation"></el-input>-->
                                        <el-select v-model="date.constellation" placeholder="请选择">
                                            <el-option
                                                    v-for="item in constellationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="身高"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="date.height"></el-input>
                                    </el-form-item>
                                    <el-form-item label="体重"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="date.weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="教育"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <!--                                        <el-input v-model="date.education"></el-input>-->
                                        <el-select v-model="date.education" placeholder="请选择">
                                            <el-option
                                                    v-for="item in educationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="被喜欢数"
                                    >
                                        <el-input v-model="date.beLikeCount" type="number" :maxlength="10"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被超级喜欢数"
                                    >
                                        <el-input type="number" v-model="date.beSuperLikeCount"
                                                  :maxlength="10"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被屏蔽次数"
                                    >
                                        <el-input type="number" v-model="date.beShieldingCount"
                                                  :maxlength="10"></el-input>
                                    </el-form-item>
                                    <el-form-item label="说点什么"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input type="textarea" :rows="4" v-model="date.describe"></el-input>
                                    </el-form-item>

                                    <!--兴趣-->
                                    <el-form-item :label="item.typeName"
                                                  v-for="(item,index) in date.interestTypeBOList"
                                                  :key="index"
                                                  class="interse">
                                        <div>
                                            <el-select v-model="item.interestStrList" placeholder="请选择"
                                                       multiple
                                                       filterable
                                                       allow-create
                                                       default-first-option
                                            >
                                                <el-option-group
                                                        v-for="group in interest"
                                                        :key="group.label"
                                                        :label="group.label">
                                                    <el-option
                                                            v-for="item in group.options"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.label">
                                                    </el-option>
                                                </el-option-group>
                                            </el-select>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <UpLoad
                                                class="upload"
                                                idName="dateId"
                                                :onUpLoadSuccess="imgsuccess1"
                                                :onUpLoadRemove="imgRemove1"
                                                :onUpLoadError="onUpLoadError"
                                                :multiple="true"
                                                :drag="true"
                                                :showFileList="false"
                                                accept="image/*"
                                                :fileList="datelist"
                                                :filesNumber="7"
                                        >
                                        </UpLoad>
                                    </el-row>
                                    <el-row>
                                        <div
                                                class="color-item"
                                                v-for="item in date.pictureBOList"
                                                v-dragging="{ item: item, list: date.pictureBOList}"
                                                :key="item.pictureUrl"
                                        >
                                            <img :src="item.pictureUrl" alt="">
                                            <div class="item-url">
                                                {{item.pictureUrl}}
                                            </div>
                                            <div class="operation">
                                                <i class="el-icon-delete"></i>
                                            </div>
                                        </div>
                                    </el-row>
                                </el-col>
                            </el-row>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="FRIEND" name="second">
                        <div>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="昵称"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="friend.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change'}]">
                                        <el-radio-group v-model="friend.sex" size="small">
                                            <el-radio-button label="男"></el-radio-button>
                                            <el-radio-button label="女"></el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="生日"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-date-picker
                                                format="yyyy/MM/dd"
                                                value-format="yyyy/MM/dd"
                                                v-model="friend.birthday"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="出生地"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-cascader
                                                v-model="friend.birthplace"
                                                :options="options"
                                                :props="{ expandTrigger: 'click', value: 'name', label: 'name', children: 'chinaRegionBOList' }"
                                                @change="handleCascaderChange"></el-cascader>
                                    </el-form-item>
                                    <el-form-item label="星座"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-select v-model="friend.constellation" placeholder="请选择">
                                            <el-option
                                                    v-for="item in constellationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="身高"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="friend.height"></el-input>
                                    </el-form-item>
                                    <el-form-item label="体重"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="friend.weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="教育"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-select v-model="friend.education" placeholder="请选择">
                                            <el-option
                                                    v-for="item in educationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="被喜欢数">
                                        <el-input v-model="friend.beLikeCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被超级喜欢数">
                                        <el-input type="number" v-model="friend.beSuperLikeCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被屏蔽次数">
                                        <el-input type="number" v-model="friend.beShieldingCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="说点什么"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input type="textarea" :rows="4" v-model="friend.describe"></el-input>
                                    </el-form-item>

                                    <!--兴趣-->
                                    <el-form-item :label="item.typeName"
                                                  v-for="(item,index) in friend.interestTypeBOList"
                                                  :key="index"
                                                  class="interse">
                                        <div>
                                            <el-select v-model="item.interestStrList" placeholder="请选择"
                                                       multiple
                                                       filterable
                                                       allow-create
                                                       default-first-option
                                            >
                                                <el-option-group
                                                        v-for="group in interest"
                                                        :key="group.label"
                                                        :label="group.label">
                                                    <el-option
                                                            v-for="item in group.options"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.label">
                                                    </el-option>
                                                </el-option-group>
                                            </el-select>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <UpLoad
                                                class="upload"
                                                drag="true"
                                                idName="dateId"
                                                :onUpLoadSuccess="imgsuccess2"
                                                :onUpLoadRemove="imgRemove2"
                                                :onUpLoadError="onUpLoadError"
                                                :multiple="true"
                                                :drag="true"
                                                :show-file-list="true"
                                                accept="image/*"
                                                :fileList="friendlist"
                                                :filesNumber="7"
                                        >
                                        </UpLoad>
                                    </el-row>
                                    <el-row>
                                        <div
                                                class="color-item"
                                                v-for="item in friend.pictureBOList"
                                                v-dragging="{ item: item, list: friend.pictureBOList}"
                                                :key="item.pictureUrl"
                                        >
                                            <img :src="item.pictureUrl" alt="">
                                            <div class="item-url">
                                                {{item.pictureUrl}}
                                            </div>
                                            <div class="operation">
                                                <i class="el-icon-delete"></i>
                                            </div>
                                        </div>
                                    </el-row>
                                </el-col>
                            </el-row>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="CAR" name="third" v-if="">
                        <div>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="昵称"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="car.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-radio-group v-model="car.sex" size="small">
                                            <el-radio-button label="男"></el-radio-button>
                                            <el-radio-button label="女"></el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="生日"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-date-picker
                                                format="yyyy/MM/dd"
                                                value-format="yyyy/MM/dd"
                                                v-model="car.birthday"
                                                type="date"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="出生地"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-cascader
                                                v-model="car.birthplace"
                                                :options="options"
                                                :props="{ expandTrigger: 'click', value: 'name', label: 'name', children: 'chinaRegionBOList' }"
                                                @change="handleCascaderChange"></el-cascader>
                                        
                                    </el-form-item>
                                    <el-form-item label="星座"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-select v-model="car.constellation" placeholder="请选择">
                                            <el-option
                                                    v-for="item in constellationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="身高"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="car.height"></el-input>
                                    </el-form-item>
                                    <el-form-item label="体重"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input v-model="car.weight"></el-input>
                                    </el-form-item>
                                    <el-form-item label="教育"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-select v-model="car.education" placeholder="请选择">
                                            <el-option
                                                    v-for="item in educationData"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="被喜欢数">
                                        <el-input v-model="car.beLikeCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被超级喜欢数">
                                        <el-input type="number" v-model="car.beSuperLikeCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="被屏蔽次数">
                                        <el-input type="number" v-model="car.beShieldingCount"></el-input>
                                    </el-form-item>
                                    <el-form-item label="说点什么"
                                                  :rules="[{required: true, message: '该项不能为空', trigger: 'change,blur'}]">
                                        <el-input type="textarea" :rows="4" v-model="car.describe"></el-input>
                                    </el-form-item>

                                    <!--兴趣-->
                                    <el-form-item :label="item.typeName"
                                                  v-for="(item,index) in car.interestTypeBOList"
                                                  :key="index"
                                                  class="interse">
                                        <div>
                                            <el-select v-model="item.interestStrList" placeholder="请选择"
                                                       multiple
                                                       filterable
                                                       allow-create
                                                       default-first-option
                                            >
                                                <el-option-group
                                                        v-for="group in interest"
                                                        :key="group.label"
                                                        :label="group.label">
                                                    <el-option
                                                            v-for="item in group.options"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.label">

                                                    </el-option>
                                                </el-option-group>
                                            </el-select>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <UpLoad
                                            class="upload"
                                            drag="true"
                                            idName="dateId"
                                            :onUpLoadSuccess="imgsuccess3"
                                            :onUpLoadRemove="imgRemove3"
                                            :onUpLoadError="onUpLoadError"
                                            :multiple="true"
                                            :drag="true"
                                            :show-file-list="true"
                                            accept="image/*"
                                            :fileList="carlist"
                                            :filesNumber="7"
                                    >
                                    </UpLoad>

                                </el-col>
                            </el-row>

                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="showVisible = false">关 闭</el-button>
                    <el-button @click="saveEdit('form')">保 存</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>

    import UpLoad from '../../common/Upload.vue';
    import draggable from 'vuedraggable'

    export default {
        name: 'UserManage',
        display: "Clone",
        order: 2,
        components: {UpLoad, draggable},
        data() {
            return {
                // 教育数据
                educationData: ['初中', '高中', '大专', '本科', '硕士', '博士', '略'],
                // 星座数据
                constellationData: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'],
                options: [],//省市数据
                pickerOptions: {//日期选择器的设置参数
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                dateSelect: [],
                interest: [],
                interType: [],
                datelist: [],
                friendlist: [],
                carlist: [],
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
                model: [],
                date: {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'date',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                },
                friend: {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'friend',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                },
                car: {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'car',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                },
                form: {
                    id: '',
                    carStatus: '',
                    certificationStatus: '',
                    latitude: '',
                    longitude: '',
                    password: '',
                    phone: '',
                    robotStatus: '',
                    userStatus: '',
                    modelBOList: [],
                },
                showVisible: false,//控制显示查看弹出层
                addVisible: false,//修改弹出框
                sexx: [{key: '男', value: '男'}, {key: '女', value: '女'}],
                //查询条件
                query: {
                    phone: '',
                    // 用户认证状态 认证状态（yes为已经认证|no为未认证|not未审核|audit审核中）
                    certificationStatus: '',
                    certificationOption: [{key: '未认证', value: 'no'}, {key: '以认证', value: 'yes'}],
                    //车辆认证状态 汽车认证状态（yes为已经认证|no为未认证|not未审核|audit审核中）
                    carStatus: '',
                    carOption: [{key: '未认证', value: 'no'}, {key: '以认证', value: 'yes'}],
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
        mounted() {
            this.$dragging.$on('dragged', ({value}) => {
                console.log(value.item)
                console.log(value.list)

            })
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



            handleCascaderChange(e, i) {
                console.log(e)
            },

            draggable(evt) {
                console.log(evt)
            },
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
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {

                this.$axios.post('/ChinaRegionController/getChinaRegionBOList').then(res => {
                    console.log(res)
                    this.options = res.data
                })

                this.$axios.post("/user/getUserList", {
                    pageNo: this.currentPage,
                    pageSize: this.PageSize,
                    phone: this.query.phone,
                    certificationStatus: this.query.certificationStatus,
                    carStatus: this.query.carStatus,
                    userStatus: this.query.userStatus,
                    robotStatus: 'yes'
                }).then(res => {
                    this.data = res.data.userBOS;
                    this.totalCount = res.data.count;
                });

                this.$axios.post("/interest/queryInterestType").then(res => {
                    this.interType = res.data;
                });

                this.$axios.post("/interest/querySelect").then(res => {
                    this.interest = res.data;
                });
            },
            //根据条件搜索
            search() {
                this.getData();
            },
            userStatus(row) {
                return row.userStatus == 'yes' ? '是' : '否';
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
            imgsuccess1(res, file) {
                this.$set(this.date.pictureBOList, this.date.pictureBOList.length, {
                    pictureStatus: 'yes',
                    pictureUrl: res,
                    sort: this.date.pictureBOList.length,
                })
                // this.date.pictureBOList.push({
                //     pictureStatus: 'yes',
                //     pictureUrl: res,
                //     sort: this.date.pictureBOList.length,
                // });
            },
            imgRemove1(file, fileList) {
                for (let i = 0; i < this.date.pictureBOList.length; i++) {
                    if (file.response == this.date.pictureBOList[i].pictureUrl) {
                        this.date.pictureBOList.splice(i, 1);
                    }
                }
            },
            imgsuccess2(res, file) {
                this.friend.pictureBOList.push({
                    pictureStatus: 'yes',
                    pictureUrl: res,
                    sort: this.date.pictureBOList.length,
                });
            },
            imgRemove2(file, fileList) {
                for (let i = 0; i < this.friend.pictureBOList.length; i++) {
                    if (file.response == this.friend.pictureBOList[i].pictureUrl) {
                        this.friend.pictureBOList.splice(i, 1);
                    }
                }
            },
            imgsuccess3(res, file) {
                this.car.pictureBOList.push({
                    pictureStatus: 'yes',
                    pictureUrl: res,
                    sort: 0,
                });
            },
            imgRemove3(file, fileList) {
                for (let i = 0; i < this.car.pictureBOList.length; i++) {
                    if (file.response == this.car.pictureBOList[i].pictureUrl) {
                        this.car.pictureBOList.splice(i, 1);
                    }
                }
            },

            onUpLoadError(err) {
                console.error(err);
                this.$message.success('上传失败，请重新上传！');
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
            add() {
                this.showVisible = true;
                //初始化兴趣
                this.initInt();
                //

            },
            initInt() {
                this.datelist = [];
                this.friendlist = [];
                this.carlist = [];
                this.form = {
                    id: '',
                    carStatus: '',
                    certificationStatus: '',
                    latitude: '',
                    longitude: '',
                    password: '',
                    phone: '',
                    robotStatus: '',
                    userStatus: '',
                    modelBOList: [],
                };
                this.date = {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'date',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                };
                this.friend = {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'friend',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                };
                this.car = {
                    interestTypeBOList: [],
                    pictureBOList: [],
                    beLikeCount: '',
                    beShieldingCount: '',
                    beSuperLikeCount: '',
                    birthplace: '',
                    constellation: '',
                    describe: '',
                    education: '',
                    model: 'car',
                    modelId: '',
                    name: '',
                    sex: '',
                    superLikeCount: '',
                    height: '',
                    weight: '',
                    birthday: '',
                };

                let type1 = [];
                let type2 = [];
                let type3 = [];
                for (let i = 0; i < this.interType.length; i++) {
                    type1.push({
                        interestStrList: [],
                        typeName: this.interType[i].typeName,
                        typeId: this.interType[i].id
                    });
                    type2.push({
                        interestStrList: [],
                        typeName: this.interType[i].typeName,
                        typeId: this.interType[i].id
                    });
                    type3.push({
                        interestStrList: [],
                        typeName: this.interType[i].typeName,
                        typeId: this.interType[i].id
                    });
                }
                this.date.interestTypeBOList = type1;
                this.friend.interestTypeBOList = type2;
                this.car.interestTypeBOList = type3;
            },
            isEmpty(obj) {
                if (typeof obj == "undefined" || obj == null || obj == "") {
                    return true;
                } else {
                    return false;
                }
            },
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //验证三个模式下的图片是否上传
                        if (this.date.pictureBOList.length < 1 || this.friend.pictureBOList.length < 1 || this.car.pictureBOList.length < 1) {
                            this.$message.error(`图片未上传`);
                            return;
                        }
                        if (this.isEmpty(this.date.birthplace) || this.isEmpty(this.date.constellation) || this.isEmpty(this.date.birthday)
                            || this.isEmpty(this.date.describe) || this.isEmpty(this.date.education) || this.isEmpty(this.date.name)
                            || this.isEmpty(this.date.sex) || this.isEmpty(this.date.height) || this.isEmpty(this.date.weight)
                        ) {
                            this.$message.error(`DATE信息不全`);
                            return;
                        }
                        if (this.isEmpty(this.friend.birthplace) || this.isEmpty(this.friend.constellation) || this.isEmpty(this.friend.birthday)
                            || this.isEmpty(this.friend.describe) || this.isEmpty(this.friend.education) || this.isEmpty(this.friend.name)
                            || this.isEmpty(this.friend.sex) || this.isEmpty(this.friend.height) || this.isEmpty(this.friend.weight)
                        ) {
                            this.$message.error(`FRIEND信息不全`);
                            return;
                        }

                        if (this.isEmpty(this.car.birthplace) || this.isEmpty(this.car.constellation) || this.isEmpty(this.car.birthday)
                            || this.isEmpty(this.car.describe) || this.isEmpty(this.car.education) || this.isEmpty(this.car.name)
                            || this.isEmpty(this.car.sex) || this.isEmpty(this.car.height) || this.isEmpty(this.car.weight)
                        ) {
                            this.$message.error(`CAR信息不全`);
                            return;
                        }
                        //处理兴趣
                        this.form.modelBOList = [this.date, this.friend, this.car];
                        if (this.form.id == null || this.form.id == '') {
                            this.$axios({
                                url: '/user/addRobotUser',
                                method: 'POST',
                                data: {userBOJson: "[" + JSON.stringify(this.form) + "]"},
                            }).then(res => {
                                if (res) {
                                    this.$message.success(`操作成功`);
                                    this.getData();
                                    this.editVisible = false;
                                }
                            });
                        } else {
                            this.$axios({
                                url: '/user/updRobotUser',
                                method: 'POST',
                                data: {userBOJson: "[" + JSON.stringify(this.form) + "]"},
                            }).then(res => {
                                if (res) {
                                    this.$message.success(`操作成功`);
                                    this.getData();
                                    this.editVisible = false;
                                }
                            });
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            //查看单个用户
            getUserById(index, row) {
                this.form.id = row.id;
                this.initInt();
                this.$axios.post("/user/getRobotUser", {
                    userId: row.id
                }).then(res => {
                    this.form.id = res.data.id;
                    this.form.carStatus = res.data.carStatus;
                    this.form.certificationStatus = res.data.certificationStatus;
                    this.form.latitude = res.data.latitude;
                    this.form.longitude = res.data.longitude;
                    this.form.password = res.data.password;
                    this.form.phone = res.data.phone;
                    this.form.robotStatus = res.data.robotStatus;
                    this.form.userStatus = res.data.userStatus;
                    this.form.modelBOList = [];

                    for (let i = 0; i < res.data.modelBOList.length; i++) {
                        if (res.data.modelBOList[i].model == 'date') {
                            this.date.pictureBOList = res.data.modelBOList[i].pictureBOList;
                            //处理图片
                            for (let y = 0; y < this.date.pictureBOList.length; y++) {
                                delete this.date.pictureBOList[y].createTime;
                                delete this.date.pictureBOList[y].updateTime;
                                delete this.date.pictureBOList[y].id;
                                delete this.date.pictureBOList[y].model;
                                delete this.date.pictureBOList[y].modelId;
                                this.datelist.push({
                                    name: this.date.pictureBOList[y].pictureUrl,
                                    url: this.date.pictureBOList[y].pictureUrl
                                });
                            }

                            //处理兴趣
                            for (let y = 0; y < this.date.interestTypeBOList.length; y++) {
                                for (let x = 0; x < res.data.modelBOList[i].interestTypeBOList.length; x++) {

                                    if (this.date.interestTypeBOList[y].typeId == res.data.modelBOList[i].interestTypeBOList[x].id) {
                                        for (let z = 0; z < res.data.modelBOList[i].interestTypeBOList[x].interestBOList.length; z++) {
                                            this.date.interestTypeBOList[y].interestStrList.push(res.data.modelBOList[i].interestTypeBOList[x].interestBOList[z].interestName);
                                        }
                                    }
                                }
                            }

                            this.date.beLikeCount = res.data.modelBOList[i].beLikeCount;
                            this.date.beShieldingCount = res.data.modelBOList[i].beShieldingCount;
                            this.date.beSuperLikeCount = res.data.modelBOList[i].beSuperLikeCount;
                            this.date.birthplace = res.data.modelBOList[i].birthplace;
                            this.date.constellation = res.data.modelBOList[i].constellation;
                            this.date.describe = res.data.modelBOList[i].describe;
                            this.date.name = res.data.modelBOList[i].name;
                            this.date.modelId = res.data.modelBOList[i].id;
                            this.date.sex = res.data.modelBOList[i].sex;
                            this.date.superLikeCount = res.data.modelBOList[i].superLikeCount;
                            this.date.height = res.data.modelBOList[i].height;
                            this.date.weight = res.data.modelBOList[i].weight;
                            this.date.birthday = new Date(res.data.modelBOList[i].birthday.time);
                            this.date.education = res.data.modelBOList[i].education;

                        } else if (res.data.modelBOList[i].model == 'friend') {
                            this.friend.pictureBOList = res.data.modelBOList[i].pictureBOList;
                            //处理图片
                            for (let y = 0; y < this.friend.pictureBOList.length; y++) {
                                delete this.friend.pictureBOList[y].createTime;
                                delete this.friend.pictureBOList[y].updateTime;
                                delete this.friend.pictureBOList[y].id;
                                delete this.friend.pictureBOList[y].model;
                                delete this.friend.pictureBOList[y].modelId;
                                this.friendlist.push({
                                    name: this.friend.pictureBOList[y].pictureUrl,
                                    url: this.friend.pictureBOList[y].pictureUrl
                                });
                            }

                            //处理兴趣
                            for (let y = 0; y < this.friend.interestTypeBOList.length; y++) {
                                for (let x = 0; x < res.data.modelBOList[i].interestTypeBOList.length; x++) {

                                    if (this.friend.interestTypeBOList[y].typeId == res.data.modelBOList[i].interestTypeBOList[x].id) {

                                        for (let z = 0; z < res.data.modelBOList[i].interestTypeBOList[x].interestBOList.length; z++) {
                                            this.friend.interestTypeBOList[y].interestStrList.push(res.data.modelBOList[i].interestTypeBOList[x].interestBOList[z].interestName);
                                        }
                                    }
                                }
                            }

                            this.friend.beLikeCount = res.data.modelBOList[i].beLikeCount;
                            this.friend.beShieldingCount = res.data.modelBOList[i].beShieldingCount;
                            this.friend.beSuperLikeCount = res.data.modelBOList[i].beSuperLikeCount;
                            this.friend.birthplace = res.data.modelBOList[i].birthplace;
                            this.friend.constellation = res.data.modelBOList[i].constellation;
                            this.friend.describe = res.data.modelBOList[i].describe;
                            this.friend.name = res.data.modelBOList[i].name;
                            this.friend.modelId = res.data.modelBOList[i].id;
                            this.friend.sex = res.data.modelBOList[i].sex;
                            this.friend.superLikeCount = res.data.modelBOList[i].superLikeCount;
                            this.friend.height = res.data.modelBOList[i].height;
                            this.friend.weight = res.data.modelBOList[i].weight;
                            this.friend.birthday = new Date(res.data.modelBOList[i].birthday.time);
                            this.friend.education = res.data.modelBOList[i].education;

                        } else if (res.data.modelBOList[i].model == 'car') {
                            this.car.pictureBOList = res.data.modelBOList[i].pictureBOList;
                            //处理图片
                            for (let y = 0; y < this.car.pictureBOList.length; y++) {
                                delete this.car.pictureBOList[y].createTime;
                                delete this.car.pictureBOList[y].updateTime;
                                delete this.car.pictureBOList[y].id;
                                delete this.car.pictureBOList[y].model;
                                delete this.car.pictureBOList[y].modelId;
                                this.carlist.push({
                                    name: this.car.pictureBOList[y].pictureUrl,
                                    url: this.car.pictureBOList[y].pictureUrl
                                });
                            }

                            //处理兴趣
                            for (let y = 0; y < this.car.interestTypeBOList.length; y++) {
                                for (let x = 0; x < res.data.modelBOList[i].interestTypeBOList.length; x++) {

                                    if (this.car.interestTypeBOList[y].typeId == res.data.modelBOList[i].interestTypeBOList[x].id) {

                                        for (let z = 0; z < res.data.modelBOList[i].interestTypeBOList[x].interestBOList.length; z++) {
                                            this.car.interestTypeBOList[y].interestStrList.push(res.data.modelBOList[i].interestTypeBOList[x].interestBOList[z].interestName);
                                        }
                                    }
                                }
                            }

                            this.car.beLikeCount = res.data.modelBOList[i].beLikeCount;
                            this.car.beShieldingCount = res.data.modelBOList[i].beShieldingCount;
                            this.car.beSuperLikeCount = res.data.modelBOList[i].beSuperLikeCount;
                            this.car.birthplace = res.data.modelBOList[i].birthplace;
                            this.car.constellation = res.data.modelBOList[i].constellation;
                            this.car.describe = res.data.modelBOList[i].describe;
                            this.car.name = res.data.modelBOList[i].name;
                            this.car.modelId = res.data.modelBOList[i].id;
                            this.car.sex = res.data.modelBOList[i].sex;
                            this.car.superLikeCount = res.data.modelBOList[i].superLikeCount;
                            this.car.height = res.data.modelBOList[i].height;
                            this.car.weight = res.data.modelBOList[i].weight;
                            this.car.birthday = new Date(res.data.modelBOList[i].birthday.time);
                            this.car.education = res.data.modelBOList[i].education;
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
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }


    .handle-input {
        width: 150px;
        margin-left: 10px;
        display: inline-block;
    }

    .handle-input-search {
        margin-left: 10px;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .imgs {
        width: 100px;
        height: 80px;
    }

    .interse {
        line-height: 30px;

    }

    .color-item {
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;
    }

    .color-item > img {
        flex-grow: 1;
        width: 100px;
        border-radius: 4px;
    }

    .color-item .item-url {
        flex-grow: 2;
    }

    .color-item .operation {
        position: absolute;
        top: 5%;
        right: 2%;
        flex-grow: 1;
        display: none;
        cursor: pointer;
    }

    .color-item:hover .operation {
        display: block;
    }
</style>
