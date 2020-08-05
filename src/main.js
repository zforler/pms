import Vue from 'vue'
import VueRouter from "vue-router";
import App from './App.vue'
// import HelloWorld from "@/components/HelloWorld";
import Layout from "@/components/Layout";
import ViewA from "@/components/ViewA";
import ViewB from "@/components/ViewB";

Vue.config.productionTip = false

Vue.use(VueRouter)



const router = new VueRouter({
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '',
      component: Layout,
      children: [
        {
          text: '菜单一',
          path: '/a1',
          component: ViewA },
        {
          text: '菜单二',
          path: '/b1',
          component: ViewB }
      ]
    }
  ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
