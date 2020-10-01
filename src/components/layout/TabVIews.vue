<template>
  <div class="l-tabviews">
    <keep-alive>
     <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
name: "TabVIews"
}
</script>

<style lang="scss" scoped>
  /*.l-tabviews{*/
    /*min-height: calc(100vh - 156px);*/
  /*}*/

</style>