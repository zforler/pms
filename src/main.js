import Vue from 'vue';
import VueRouter from "vue-router";
import App from './App.vue';
import * as filters from './util/filters';
import Layout from "@/components/layout/Layout";
import login from "@/page/login/login";
import Company from "@/components/Company/Company";
import {Table,TableColumn, Button,Select,Input,Option,Dialog,Form,FormItem,Pagination,Tree,Tooltip,Radio,RadioGroup,
    Message,Autocomplete,Loading} from "element-ui";
import './icons';
import localCache from "./util/localCache";
import Menu from '@/components/Menu/Menu'
Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(VueRouter)
Vue.use(Company)
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
Vue.use(Tooltip)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.prototype.$message = Message;
Vue.use(Autocomplete)
Vue.use(Loading)

const temp = {
  template: `<router-view></router-view>`
}
console.log(process)

const router = new VueRouter({
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: '登录',
      path: '/login',
      component: login,
      hidden: true,
    },
      {
          name: '首页',
          path: '/',
          component: Layout,
          type: 1,
          hidden: true,
          close: 0,
          children: [
              {
                  name: '首页',
                  path: '/index',
                  type: 2,
                  icon: 'add',
                  icon: 'index',
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
            icon: 'custom',
            component: () => import('./page/customer/customer.vue')
          }
        ]
      },
    {
      name: '人事薪资',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'solid',
      children: [
        {
          name: '员工管理',
          path: '/staff',
          type: 2,
          icon: 'staff',
          component: () => import('./page/staff/staff.vue')
        },
      {
          name: '工资统计',
          path: '/salary',
          type: 2,
          icon: 'salary',
          component: () => import('./page/salary/salary.vue')
      }
      ]
    },
    {
      name: '用户管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'user',
      children: [
        {
          name: '用户管理',
          path: '/user',
          type: 2,
          icon: 'user',
          component: () => import('./page/user/user.vue')
        },
        {
          name: '角色管理',
          path: '/role',
          type: 2,
          icon: 'role',
          component: () => import('./page/user/role.vue')
        }
      ]
    },
    {
      name: '生产管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'product',
      children: [
        {
          name: '产品管理',
          path: '/production',
          type: 2,
          icon: 'production',
          component: () => import('./page/production/production.vue')
        },
        {
          name: '工艺管理',
          path: '/technology',
          type: 2,
          icon: 'technology',
          component: () => import('./page/production/technology.vue')
        },
        {
          name: '规格管理',
          path: '/spec',
          type: 2,
          icon: 'spec',
          component: () => import('./page/production/spec.vue')
        },
        {
          name: '批次管理',
          path: '/batch',
          type: 2,
          icon: 'batch',
          component: () => import('./page/production/batch.vue')
        },
        {
          name: '工价管理',
          path: '/price',
          type: 2,
          icon: 'price',
          component: () => import('./page/production/price.vue')
        },
          {
              name: '班次管理',
              path: '/shift',
              type: 2,
              icon: 'shift',
              component: () => import('./page/production/shift.vue')
          },
          {
              name: '交料修正',
              path: '/productEdit',
              type: 2,
              icon: 'productEdit',
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
          icon: 'card',
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
          icon: 'organization',
          component: () => import('./page/organization/organization.vue')
        }
      ]
    },
    {
      name: '设备管理',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'equipment',
      children: [
        {
          name: '设备管理',
          path: '/equipment',
          type: 2,
          icon: 'equip',
          component: () => import('./page/equipment/equipment.vue')
        },
        {
          name: '设备故障日志',
          path: '/equipmentFaultLog',
          type: 2,
          icon: 'equipmentFaultLog',
          component: () => import('./page/equipment/equipmentFaultLog.vue')
        },
        {
          name: '生产记录',
          path: '/productLog',
          type: 2,
          icon: 'productLog',
          component: () => import('./page/equipment/productLog.vue')
        },
      ]
    },
    {
      name: '我的报表',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'report',
      hidden: true,
      children: [
        {
          name: '我的报表',
          path: '/report',
          type: 2,
          icon: 'report',
          component: () => import('./page/report/report.vue')
        }
      ]
    },
    {
      name: '系统设置',
      path: '/',
      component: Layout,
      type: 1,
      icon: 'setting',
      children: [
        {
          name: '菜单管理',
          path: '/menu',
          type: 2,
          icon: 'menu',
          component: () => import('./page/system/menu.vue')
        },
        {
          name: '数据字典',
          path: '/dataItem',
          type: 2,
          icon: 'dataItem',
          component: () => import('./page/system/dataItem.vue')
        },
        {
          name: '操作日志',
          path: '/operateLog',
          type: 2,
          icon: 'operateLog',
          component: () => import('./page/system/operateLog.vue')
        }
      ]
    },
    ]
})

router.beforeEach((to, from, next) => {
    if(to.name != '登录'){
        let token = localCache.getToken();
        console.log('token', token)
        if(!token){
            next({ path: '/login' })
            return false
        }
    }
    next()
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
