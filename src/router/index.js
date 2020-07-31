import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            name: 'home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            redirect: '/home/appraisal',
            meta: {title: '首页'},
            children: [
                {
                    path: '/home/admin',
                    name: 'admin',
                    component: resolve => require(['../components/page/system/admin.vue'], resolve),
                    meta: {title: '管理员列表', permission: true, index: 'admin'}
                },
                {
                    path: '/home/role',
                    name: 'role',
                    component: resolve => require(['../components/page/system/role.vue'], resolve),
                    meta: {title: '角色列表', permission: true, index: 'role'}
                },
                {
                    path: '/home/user',
                    name: 'user',
                    component: resolve => require(['../components/page/User/UserManage.vue'], resolve),
                    meta: {title: '用户列表', permission: true, index: 'user'} /* 已修改 */
                },
                {
                    path: '/home/interest',
                    name: 'interest',
                    component: resolve => require(['../components/page/param/interest.vue'], resolve),
                    meta: {title: '兴趣爱好', permission: true, index: 'interest'}
                },
                {
                    path: '/home/case',
                    name: 'case',
                    component: resolve => require(['../components/page/param/case.vue'], resolve),
                    meta: {title: '认证案例', permission: true, index: 'case'}
                },
                {
                    path: '/home/userAudit',
                    name: 'userAudit',
                    component: resolve => require(['../components/page/audit/userAudit.vue'], resolve),
                    meta: {title: '用户认证', permission: true, index: 'userAudit'}
                },
                {
                    path: '/home/imgAudit',
                    name: 'imgAudit',
                    component: resolve => require(['../components/page/audit/imgAudit.vue'], resolve),
                    meta: {title: '图像审核', permission: true, index: 'imgAudit'}
                },
                {
                    path: '/home/param',
                    name: 'param',
                    component: resolve => require(['../components/page/param/param.vue'], resolve),
                    meta: {title: '系统参数', permission: true, index: 'param'}
                },
                {
                    path: '/home/version',
                    name: 'version',
                    component: resolve => require(['../components/page/system/version.vue'], resolve),
                    meta: {title: '版本管理', permission: true, index: 'version'}
                },
                {
                    path: '/home/feedBack',
                    name: 'feedBack',
                    component: resolve => require(['../components/page/User/feedBack.vue'], resolve),
                    meta: {title: '意见反馈', permission: true, index: 'feedBack'}
                },
                {
                    path: '/home/region',
                    name: 'region',
                    component: resolve => require(['../components/page/param/region.vue'], resolve),
                    meta: {title: '地区设置', permission: true, index: 'region'}
                },
                {
                    path: '/home/robot',
                    name: 'robot',
                    component: resolve => require(['../components/page/User/RobotManage.vue'], resolve),
                    meta: {title: '虚拟用户', permission: true, index: 'region'}
                },
                {
                    path: '/home/dictionary',
                    name: 'dictionary',
                    component: resolve => require(['../components/page/param/dictionary.vue'], resolve),
                    meta: {title: '字典设置', permission: true, index: 'dictionary'}
                },
                {
                    path: '/home/incident',
                    name: 'incident',
                    component: resolve => require(['../components/page/User/incident.vue'], resolve),
                    meta: {title: '用户行程', permission: true, index: 'incident'}
                },
                {
                    path: '/home/report',
                    name: 'report',
                    component: resolve => require(['../components/page/User/report.vue'], resolve),
                    meta: {title: '举报列表', permission: true, index: 'report'}
                },
                {
                    path: '/home/car',
                    name: 'car',
                    component: resolve => require(['../components/page/audit/car.vue'], resolve),
                    meta: {title: '车辆认证', permission: true, index: 'car'}
                },
                {
                    path: '/home/statistics',
                    name: 'statistics',
                    component: resolve => require(['../components/page/statistics/statistics.vue'], resolve),
                    meta: {title: '统计图表', permission: true, index: 'statistics'}
                },





                {
                    path: '/home/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: {title: '404'}
                },
                {
                    path: '/home/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: {title: '403'}
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/home/404'
        }
    ]
})