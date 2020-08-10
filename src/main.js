import Vue from 'vue'
import VueRouter from "vue-router";
import App from './App.vue'
import Layout from "@/components/layout/Layout";
import {Table,TableColumn, Button,Select,Input,Option,Dialog,Form,FormItem,Pagination,Tree} from "element-ui";

Vue.config.productionTip = false

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
        name: '客户管理',
        path: '/',
        component: Layout,
        type: 1,
        children: [
          {
            name: '客户管理',
            path: '/customer',
            type: 2,
            component: () => import('./components/customer/customer.vue')
          }
        ]
      },
    {
      name: '员工管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '员工管理',
          path: '/staff',
          type: 2,
          component: () => import('./components/staff/staff.vue')
        }
      ]
    },
    {
      name: '用户管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '用户管理',
          path: '/user',
          type: 2,
          component: () => import('./components/user/user.vue')
        },
        {
          name: '角色管理',
          path: '/role',
          type: 2,
          component: () => import('./components/user/role.vue')
        }
      ]
    },
    {
      name: '产品管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '产品管理',
          path: '/production',
          type: 2,
          component: () => import('./components/production/production.vue')
        },
        {
          name: '工艺管理',
          path: '/technology',
          type: 2,
          component: () => import('./components/production/technology.vue')
        },
        {
          name: '规格管理',
          path: '/spec',
          type: 2,
          component: () => import('./components/production/spec.vue')
        },
        {
          name: '批次管理',
          path: '/spec',
          type: 2,
          component: () => import('./components/production/batch.vue')
        },
        {
          name: '工价管理',
          path: '/price',
          type: 2,
          component: () => import('./components/production/price.vue')
        },
      ]
    },
    {
      name: '电卡管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '电卡管理',
          path: '/card',
          type: 2,
          component: () => import('./components/card/card.vue')
        }
      ]
    },
    {
      name: '组织架构管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '组织架构管理',
          path: '/organization',
          type: 2,
          component: () => import('./components/organization/organization.vue')
        }
      ]
    },
    {
      name: '设备管理',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '设备管理',
          path: '/equipment',
          type: 2,
          component: () => import('./components/equipment/equipment.vue')
        }
      ]
    },
    {
      name: '我的报表',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '我的报表',
          path: '/report',
          type: 2,
          component: () => import('./components/report/report.vue')
        }
      ]
    },
    {
      name: '系统设置',
      path: '/',
      component: Layout,
      type: 1,
      children: [
        {
          name: '系统设置',
          path: '/system',
          type: 2,
          component: () => import('./components/system/system.vue')
        }
      ]
    },
    ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
