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
        { path: '/a1', component: ViewA },
        { path: '/b/b', component: ViewB }
      ]
    }
  ]
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
