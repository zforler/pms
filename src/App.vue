<template>
  <div id="app">
    <router-view></router-view>
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
import { getSysDicList } from './api/datadic'
export default {
  name: 'App',
  components: {
    // HelloWorld
  },
   async mounted(){
        console.log('app init')
        if(this.$router.currentRoute.name != '登录'){
            await this.getSysDicList_()
        }
    },
    methods:{
        getSysDicList_(){
            return new Promise((resolve,reject)=>{
                getSysDicList({
                    keyword: this.searchValue
                }).then((res)=>{
                    let [tree,tree2] = this.toTree(res.data)
                    // this.$store.dispatch('saveDic',tree)
                    this.$store.commit('SET_DIC',tree)
                    // console.log(tree2)
                    // this.$store.dispatch('saveDicFilter',tree2)
                    this.$store.commit('SET_DIC_F',tree2)
                    resolve()
                }).catch((err)=>{
                    reject(err)
                })
            })

        },
        toTree(data){
            let temp = {}
            let temp2 = {}
            for (let i = 0,len=data.length; i < len; i++) {
                let t = data[i]
                let code = t.code
                if(!temp[code]){
                    temp[code] = {
                        code: code,
                        key: code,
                        name: t.name,
                        children:[]
                    }
                }
                if(t.itemCode){
                    temp[code].children.push({
                        code: t.itemCode,
                        parentCode:t.code,
                        name: t.itemName,
                        key: t.id,
                        type: 'sub'
                    })
                    temp2[t.code+t.itemCode] = t.itemName
                }
            }
            return [temp,temp2]
        }
    }
}
</script>

<style lang="scss">
@import "./styles/common";
*{
  box-sizing: border-box;
}
body{
  background-color: $theme-color;
  padding: 0;
  margin: 0;
}

</style>
