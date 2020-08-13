import Vue from 'vue'
import VueRouter from "vue-router";
import App from './App.vue'
import * as filters from './util/filters'
import Layout from "@/components/layout/Layout";
import {Table,TableColumn, Button,Select,Input,Option,Dialog,Form,FormItem,Pagination,Tree} from "element-ui";
import './icons'

Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(VueRouter)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.use(Tree)

const temp = {
  template: `<router-view></router-view>`
}
const router = new VueRouter({
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
      {
          name: '首页',
          path: '/',
          component: Layout,
          type: 1,
          hidden: true,
          close: false,
          children: [
              {
                  name: '首页',
                  path: '/index',
                  type: 2,
                  icon: 'el-icon-s-home',
                  meta: {close:false},
                  component: () => import('./page/index/index.vue')
              }
          ]
      },
      {
        name: '客户管理',
        path: '/',
        component: Layout,
        type: 1,
        hidden: true,
        children: [
          {
            name: '客户管理',
            path: '/customer',
            type: 2,
            icon: 'el-icon-s-custom',
            component: () => import('./page/customer/customer.vue')
          }
        ]
      },
    {
      name: '人事薪资',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-user-solid',
      children: [
        {
          name: '员工管理',
          path: '/staff',
          type: 2,
          icon: 'el-icon-user-solid',
          component: () => import('./page/staff/staff.vue')
        },
      {
          name: '工资管理',
          path: '/salary',
          type: 2,
          icon: 'el-icon-date',
          component: () => import('./page/salary/salary.vue')
      }
      ]
    },
    {
      name: '用户管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-user',
      children: [
        {
          name: '用户管理',
          path: '/user',
          type: 2,
          icon: 'el-icon-user',
          component: () => import('./page/user/user.vue')
        },
        {
          name: '角色管理',
          path: '/role',
          type: 2,
          icon: 'el-icon-medal',
          component: () => import('./page/user/role.vue')
        }
      ]
    },
    {
      name: '生产管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-s-grid',
      children: [
        {
          name: '产品管理',
          path: '/production',
          type: 2,
          icon: 'el-icon-s-grid',
          component: () => import('./page/production/production.vue')
        },
        {
          name: '工艺管理',
          path: '/technology',
          type: 2,
          icon: 'el-icon-s-operation',
          component: () => import('./page/production/technology.vue')
        },
        {
          name: '规格管理',
          path: '/spec',
          type: 2,
          icon: 'el-icon-price-tag',
          component: () => import('./page/production/spec.vue')
        },
        {
          name: '批次管理',
          path: '/batch',
          type: 2,
          icon: 'el-icon-menu',
          component: () => import('./page/production/batch.vue')
        },
        {
          name: '工价管理',
          path: '/price',
          type: 2,
          icon: 'el-icon-notebook-1',
          component: () => import('./page/production/price.vue')
        },
          {
              name: '班次管理',
              path: '/shift',
              type: 2,
              icon: 'el-icon-timer',
              component: () => import('./page/production/shift.vue')
          },
          {
              name: '交料修正',
              path: '/productEdit',
              type: 2,
              icon: 'el-icon-edit',
              component: () => import('./page/production/productEdit.vue')
          },
      ]
    },
    {
      name: '电卡管理',
      path: '/',
      component: Layout,
      type: 1,
      hidden: true,
      children: [
        {
          name: '电卡管理',
          path: '/card',
          type: 2,
          icon: 'el-icon-bank-card',
          component: () => import('./page/card/card.vue')
        }
      ]
    },
    {
      name: '组织架构管理',
      path: '/',
      component: Layout,
      type: 1,
      hidden: true,
      children: [
        {
          name: '组织架构管理',
          path: '/organization',
          type: 2,
          icon: 'el-icon-share',
          component: () => import('./page/organization/organization.vue')
        }
      ]
    },
    {
      name: '设备管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-data-analysis',
      children: [
        {
          name: '设备管理',
          path: '/equipment',
          type: 2,
          icon: 'el-icon-data-analysis',
          component: () => import('./page/equipment/equipment.vue')
        },
        {
          name: '设备故障日志',
          path: '/equipmentFaultLog',
          type: 2,
          icon: 'el-icon-document',
          component: () => import('./page/equipment/equipmentFaultLog.vue')
        },
        {
          name: '生产记录',
          path: '/productLog',
          type: 2,
          icon: 'el-icon-s-order',
          component: () => import('./page/equipment/productLog.vue')
        },
      ]
    },
    {
      name: '我的报表',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-document',
      hidden: true,
      children: [
        {
          name: '我的报表',
          path: '/report',
          type: 2,
          icon: 'el-icon-document',
          component: () => import('./page/report/report.vue')
        }
      ]
    },
    {
      name: '系统设置',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'el-icon-setting',
      children: [
        {
          name: '菜单管理',
          path: '/menu',
          type: 2,
          icon: 'el-icon-document-copy',
          component: () => import('./page/system/menu.vue')
        },
        {
          name: '数据字典',
          path: '/dataItem',
          type: 2,
          icon: 'el-icon-reading',
          component: () => import('./page/system/dataItem.vue')
        },
        {
          name: '操作日志',
          path: '/operateLog',
          type: 2,
          icon: 'el-icon-document',
          component: () => import('./page/system/operateLog.vue')
        }
      ]
    },
    ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
