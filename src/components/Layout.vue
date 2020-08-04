<template>
  <div>
    <div class="l-left-container">
      <div class="l-left-logo l-flex-center">PMS</div>
      <div @click="view('a1')">a</div>
      <div @click="view('b')">b</div>
      <div>c</div>
    </div>
    <div class="l-right-container">
      <div class="l-right-top">top</div>
      <div class="l-right-bcontainer">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "Layout",
  methods: {
    view(mark){
      this.$router.push('/' + mark)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/common.scss";
  .l-left-container{
    background-color: $theme-color;
    width: 300px;
    float: left;
    height: $h-100vh;
  }
  .l-left-logo{
    height: 75px;
  }
  .l-right-container{
    background-color: $bg-color;
    width: calc(100% - 300px);
    float: left;
    height: $h-100vh;
  }
  .l-right-top{
    padding: 15px;
    height: 75px;
    background-color: #fff;
  }
  .l-right-bcontainer{
    padding: 15px;
  }
</style>