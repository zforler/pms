<template>
  <div id="app">
    <router-view></router-view>
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
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
